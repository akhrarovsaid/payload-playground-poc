import { FileSystemTree } from "@webcontainer/api";

// TODO: Replace with GH API to pull remote repo files for templates
// Will need to inject necessary stuff prior to mountFiles call
export const mockFilesBlankTemplate: FileSystemTree = {
  'package.json': {
    file: {
      contents: `
{
  "name": "template-blank-3.0",
  "version": "1.0.0",
  "description": "A blank template to get started with Payload 3.0",
  "license": "MIT",
  "type": "module",
  "scripts": {
    "build": "cross-env NODE_OPTIONS=--no-deprecation next build",
    "dev": "cross-env NODE_OPTIONS=--no-deprecation next dev",
    "devsafe": "rm -rf .next && cross-env NODE_OPTIONS=--no-deprecation next dev",
    "generate:importmap": "cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap",
    "generate:types": "cross-env NODE_OPTIONS=--no-deprecation payload generate:types",
    "lint": "cross-env NODE_OPTIONS=--no-deprecation next lint",
    "payload": "cross-env NODE_OPTIONS=--no-deprecation payload",
    "start": "cross-env NODE_OPTIONS=--no-deprecation next start"
  },
  "dependencies": {
    "@electric-sql/pglite": "^0.2.14",
    "@payloadcms/db-mongodb": "latest",
    "@payloadcms/next": "latest",
    "@payloadcms/drizzle": "latest",
    "@payloadcms/payload-cloud": "latest",
    "@payloadcms/richtext-lexical": "latest",
    "cross-env": "^7.0.3",
    "drizzle-orm": "^0.36.4",
    "graphql": "^16.8.1",
    "next": "15.1.0",
    "payload": "latest",
    "pg": "^8.13.1",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "sharp": "0.32.6"
  },
  "devDependencies": {
    "@types/node": "^22.5.4",
    "@types/react": "19.0.1",
    "@types/react-dom": "19.0.1",
    "eslint": "^8",
    "eslint-config-next": "15.0.0",
    "typescript": "5.7.2"
  },
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
      `
    }
  },
  'tsconfig.json': {
    file: {
      contents: `
{
  "compilerOptions": {
    "baseUrl": ".",
    "lib": [
      "DOM",
      "DOM.Iterable",
      "ES2022"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@payload-config": [
        "./src/payload.config.ts"
      ]
    },
    "target": "ES2022",
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
      `
    }
  },
  'next.config.mjs': {
    file: {
      contents: `
import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  serverExternalPackages: ['@electric-sql/pglite'],
}

export default withPayload(nextConfig)
      `
    }
  },
  '.prettierrc.json': {
    file: {
      contents: `
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": false
}
      `
    }
  },
  'eslintrc.cjs': {
    file: {
      contents: `
/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  parserOptions: {
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname,
  },
}
      `
    }
  },
  '.env': {
    file: {
      contents: `
DATABASE_URI=memory://
PAYLOAD_SECRET=YOUR_SECRET_HERE
      `
    }
  },
  src: {
    directory: {
      '_adapters': {
        directory: {
          'index.ts': {
            file: {
              contents: `
import type { DatabaseAdapterObj, Payload } from 'payload'

import {
  beginTransaction,
  commitTransaction,
  count,
  countGlobalVersions,
  countVersions,
  create,
  createGlobal,
  createGlobalVersion,
  createVersion,
  deleteMany,
  deleteOne,
  deleteVersions,
  destroy,
  find,
  findGlobal,
  findGlobalVersions,
  findMigrationDir,
  findOne,
  findVersions,
  migrate,
  migrateDown,
  migrateFresh,
  migrateRefresh,
  migrateReset,
  migrateStatus,
  operatorMap,
  queryDrafts,
  rollbackTransaction,
  updateGlobal,
  updateGlobalVersion,
  updateOne,
  updateVersion,
} from '@payloadcms/drizzle'
import {
  countDistinct,
  createDatabase,
  createExtensions,
  createJSONQuery,
  createMigration,
  defaultDrizzleSnapshot,
  deleteWhere,
  dropDatabase,
  execute,
  getMigrationTemplate,
  init,
  insert,
  requireDrizzleKit,
} from '@payloadcms/drizzle/postgres'
import { pgEnum, pgSchema, pgTable } from 'drizzle-orm/pg-core'
import path from 'path'
import { createDatabaseAdapter, defaultBeginTransaction } from 'payload'
import { fileURLToPath } from 'url'

import type { Args, PostgresAdapter } from './types'

import { connect } from './connect'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export function PGliteAdapter(args: Args): DatabaseAdapterObj<PostgresAdapter> {
  const postgresIDType = args.idType || 'serial'
  const payloadIDType = postgresIDType === 'serial' ? 'number' : 'text'

  function adapter({ payload }: { payload: Payload }) {
    const migrationDir = findMigrationDir(args.migrationDir)
    let resolveInitializing
    let rejectInitializing
    let adapterSchema: PostgresAdapter['pgSchema']

    const initializing = new Promise<void>((res, rej) => {
      resolveInitializing = res
      rejectInitializing = rej
    })

    if (args.schemaName) {
      adapterSchema = pgSchema(args.schemaName)
    } else {
      adapterSchema = { enum: pgEnum, table: pgTable }
    }

    const extensions = (args.extensions ?? []).reduce((acc, name) => {
      acc[name] = true
      return acc
    }, {})

    return createDatabaseAdapter<PostgresAdapter>({
      name: 'postgres',
      afterSchemaInit: args.afterSchemaInit ?? [],
      beforeSchemaInit: args.beforeSchemaInit ?? [],
      createDatabase,
      createExtensions,
      createMigration(args) {
        return createMigration.bind(this)({ ...args, dirname })
      },
      defaultDrizzleSnapshot,
      disableCreateDatabase: args.disableCreateDatabase ?? false,
      drizzle: undefined,
      enums: {},
      extensions,
      features: {
        json: true,
      },
      fieldConstraints: {},
      getMigrationTemplate,
      idType: postgresIDType,
      initializing,
      localesSuffix: args.localesSuffix || '_locales',
      logger: args.logger,
      operators: operatorMap,
      pgSchema: adapterSchema,
      pool: undefined,
      poolOptions: args.pool,
      prodMigrations: args.prodMigrations,
      push: args.push,
      relations: {},
      relationshipsSuffix: args.relationshipsSuffix || '_rels',
      schema: {},
      schemaName: args.schemaName,
      sessions: {},
      tableNameMap: new Map<string, string>(),
      tables: {},
      tablesFilter: args.tablesFilter,
      transactionOptions: args.transactionOptions || undefined,
      versionsSuffix: args.versionsSuffix || '_v',

      // DatabaseAdapter
      beginTransaction:
        args.transactionOptions === false ? defaultBeginTransaction() : beginTransaction,
      commitTransaction,
      connect,
      count,
      countDistinct,
      countGlobalVersions,
      countVersions,
      create,
      createGlobal,
      createGlobalVersion,
      createJSONQuery,
      createVersion,
      defaultIDType: payloadIDType,
      deleteMany,
      deleteOne,
      deleteVersions,
      deleteWhere,
      destroy,
      dropDatabase,
      execute,
      find,
      findGlobal,
      findGlobalVersions,
      findOne,
      findVersions,
      indexes: new Set<string>(),
      init,
      insert,
      migrate,
      migrateDown,
      migrateFresh,
      migrateRefresh,
      migrateReset,
      migrateStatus,
      migrationDir,
      packageName: '@payloadcms/db-postgres',
      payload,
      queryDrafts,
      rejectInitializing,
      requireDrizzleKit,
      resolveInitializing,
      rollbackTransaction,
      updateGlobal,
      updateGlobalVersion,
      updateOne,
      updateVersion,
      upsert: updateOne,
    })
  }

  return {
    defaultIDType: payloadIDType,
    init: adapter,
  }
}

export type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/drizzle/postgres'
export { sql } from 'drizzle-orm'
`
            }
          },
          'connect.ts': {
            file: {
              contents: `
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { Connect, Migration, Payload } from 'payload'

import { pushDevSchema } from '@payloadcms/drizzle'
import { drizzle } from 'drizzle-orm/pglite'
import pg from 'pg'

import type { PostgresAdapter } from './types.js'
import { PGlite } from '@electric-sql/pglite'

const client = new PGlite('memory://')

const connectWithReconnect = async function ({
  adapter,
  payload,
  reconnect = false,
}: {
  adapter: PostgresAdapter
  payload: Payload
  reconnect?: boolean
}) {
  let result

  if (!reconnect) {
    result = await adapter.pool.connect()
  } else {
    try {
      result = await adapter.pool.connect()
    } catch (ignore) {
      setTimeout(() => {
        payload.logger.info('Reconnecting to postgres')
        void connectWithReconnect({ adapter, payload, reconnect: true })
      }, 1000)
    }
  }
  if (!result) {
    return
  }
  result.prependListener('error', (err) => {
    try {
      if (err.code === 'ECONNRESET') {
        void connectWithReconnect({ adapter, payload, reconnect: true })
      }
    } catch (ignore) {
      // swallow error
    }
  })
}

export const connect: Connect = async function connect(
  this: PostgresAdapter,
  options = {
    hotReload: false,
  },
) {
  const { hotReload } = options

  this.schema = {
    pgSchema: this.pgSchema,
    ...this.tables,
    ...this.relations,
    ...this.enums,
  }

  try {
    /* if (!this.pool) {
      this.pool = new pg.Pool(this.poolOptions)
      await connectWithReconnect({ adapter: this, payload: this.payload })
    } */

    const logger = this.logger || false
    this.drizzle = drizzle({ client, logger, schema: this.schema })

    if (!hotReload) {
      if (process.env.PAYLOAD_DROP_DATABASE === 'true') {
        const schemaName = this.schemaName || 'public'
        this.payload.logger.info('---- DROPPING TABLES SCHEMA(' + schemaName + ') ----')
        await this.dropDatabase({ adapter: this })
        this.payload.logger.info('---- DROPPED TABLES ----')
      }
    }
  } catch (error) {
    const err = error as Error
    if (err.message?.match(/database .* does not exist/i) && !this.disableCreateDatabase) {
      // capitalize first char of the err msg
      const msg = err.message.charAt(0).toUpperCase() + err.message.slice(1) + ', creating...'
      this.payload.logger.info(msg)
      const isCreated = await this.createDatabase()

      if (isCreated && this.connect) {
        await this.connect(options)
        return
      }
    } else {
      const msg = 'Error: cannot connect to Postgres. Details: ' + err.message
      this.payload.logger.error({
        err,
        msg,
      })
    }

    if (typeof this.rejectInitializing === 'function') {
      this.rejectInitializing()
    }
    process.exit(1)
  }

  await this.createExtensions()

  // Only push schema if not in production
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.PAYLOAD_MIGRATING !== 'true' &&
    this.push !== false
  ) {
    await pushDevSchema(this as unknown as DrizzleAdapter)
  }

  if (typeof this.resolveInitializing === 'function') {
    this.resolveInitializing()
  }

  if (process.env.NODE_ENV === 'production' && this.prodMigrations) {
    await this.migrate({ migrations: this.prodMigrations as Migration[] })
  }
}

`
            }
          },
          'types.ts': {
            file: {
              contents: `
import type {
  BasePostgresAdapter,
  GenericEnum,
  MigrateDownArgs,
  MigrateUpArgs,
  PostgresDB,
  PostgresSchemaHook,
} from '@payloadcms/drizzle/postgres'
import type { DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { DrizzleConfig } from 'drizzle-orm'
import type { PgSchema, PgTableFn, PgTransactionConfig } from 'drizzle-orm/pg-core'
import type { Pool, PoolConfig } from 'pg'

export type Args = {
  /**
   * Transform the schema after it's built.
   * You can use it to customize the schema with features that aren't supported by Payload.
   * Examples may include: composite indices, generated columns, vectors
   */
  afterSchemaInit?: PostgresSchemaHook[]
  /**
   * Transform the schema before it's built.
   * You can use it to preserve an existing database schema and if there are any collissions Payload will override them.
   * To generate Drizzle schema from the database, see [Drizzle Kit introspection](https://orm.drizzle.team/kit-docs/commands#introspect--pull)
   */
  beforeSchemaInit?: PostgresSchemaHook[]
  /**
   * Pass \`true\` to disale auto database creation if it doesn't exist.
   * @default false
   */
  disableCreateDatabase?: boolean
  extensions?: string[]
  idType?: 'serial' | 'uuid'
  localesSuffix?: string
  logger?: DrizzleConfig['logger']
  migrationDir?: string
  pool: PoolConfig
  prodMigrations?: {
    down: (args: MigrateDownArgs) => Promise<void>
    name: string
    up: (args: MigrateUpArgs) => Promise<void>
  }[]
  push?: boolean
  relationshipsSuffix?: string
  /**
   * The schema name to use for the database
   * @experimental This only works when there are not other tables or enums of the same name in the database under a different schema. Awaiting fix from Drizzle.
   */
  schemaName?: string
  tablesFilter?: string[]
  transactionOptions?: false | PgTransactionConfig
  versionsSuffix?: string
}

export type PostgresAdapter = {
  pool: Pool
  poolOptions: PoolConfig
} & BasePostgresAdapter

declare module 'payload' {
  export interface DatabaseAdapter
    extends Omit<Args, 'idType' | 'logger' | 'migrationDir' | 'pool'>,
      DrizzleAdapter {
    afterSchemaInit: PostgresSchemaHook[]

    beforeSchemaInit: PostgresSchemaHook[]
    beginTransaction: (options?: PgTransactionConfig) => Promise<null | number | string>
    drizzle: PostgresDB
    enums: Record<string, GenericEnum>
    extensions: Record<string, boolean>
    /**
     * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
     * Used for returning properly formed errors from unique fields
     */
    fieldConstraints: Record<string, Record<string, string>>
    idType: Args['idType']
    initializing: Promise<void>
    localesSuffix?: string
    logger: DrizzleConfig['logger']
    pgSchema?: { table: PgTableFn } | PgSchema
    pool: Pool
    poolOptions: Args['pool']
    prodMigrations?: {
      down: (args: MigrateDownArgs) => Promise<void>
      name: string
      up: (args: MigrateUpArgs) => Promise<void>
    }[]
    push: boolean
    rejectInitializing: () => void
    relationshipsSuffix?: string
    resolveInitializing: () => void
    schema: Record<string, unknown>
    schemaName?: Args['schemaName']
    tableNameMap: Map<string, string>
    tablesFilter?: string[]
    versionsSuffix?: string
  }
}
`
            }
          },
        }
      },
      app: {
        directory: {
          '(payload)': {
            directory: {
              'admin': {
                directory: {
                  '[[...segments]]': {
                    directory: {
                      'not-found.tsx': {
                        file: {
                          contents: `
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const NotFound = ({ params, searchParams }: Args) =>
  NotFoundPage({ config, params, searchParams, importMap })

export default NotFound
                          `
                        }
                      },
                      'page.tsx': {
                        file: {
                          contents: `
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, params, searchParams, importMap })

export default Page
                          `
                        }
                      },
                    }
                  },
                  'importMap.js': {
                    file: {
                      contents: `export const importMap = {}`
                    }
                  },
                }
              },
              'api': {
                directory: {
                  '[...slug]': {
                    directory: {
                      'route.ts': {
                        file: {
                          contents: `
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const DELETE = REST_DELETE(config)
export const PATCH = REST_PATCH(config)
export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
                          `
                        }
                      }
                    }
                  },
                  'graphql-playground': {
                    directory: {
                      'route.ts': {
                        file: {
                          contents: `
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import { GRAPHQL_PLAYGROUND_GET } from '@payloadcms/next/routes'

export const GET = GRAPHQL_PLAYGROUND_GET(config)
                          `
                        }
                      }
                    }
                  },
                  'graphql': {
                    directory: {
                      'route.ts': {
                        file: {
                          contents: `
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import { GRAPHQL_POST, REST_OPTIONS } from '@payloadcms/next/routes'

export const POST = GRAPHQL_POST(config)

export const OPTIONS = REST_OPTIONS(config)
                          `
                        }
                      }
                    }
                  },
                }
              },
              'custom.scss': {
                file: {
                  contents: ``
                }
              },
              'layout.tsx': {
                file: {
                  contents: `
/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'
import './custom.scss'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
                  `
                }
              },
            }
          },
          'my-route': {
            directory: {
              'route.ts': {
                file: {
                  contents: `
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'users',
  })

  return Response.json(data)
}
                  `
                }
              }
            }
          },
        }
      },
      collections: {
        directory: {
          'Media.ts': {
            file: {
              contents: `
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}  
`
            }
          },
          'Users.ts': {
            file: {
              contents: `
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
}              
`
            }
          },
        }
      },
      'payload-types.ts': {
        file: {
          contents: `
/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run \`payload generate:types\` to regenerate this file.
 */

export interface Config {
  auth: {
    users: UserAuthOperations;
  };
  collections: {
    users: User;
    media: Media;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  db: {
    defaultIDType: string;
  };
  globals: {};
  locale: null;
  user: User & {
    collection: 'users';
  };
}
export interface UserAuthOperations {
  forgotPassword: {
    email: string;
    password: string;
  };
  login: {
    email: string;
    password: string;
  };
  registerFirstUser: {
    email: string;
    password: string;
  };
  unlock: {
    email: string;
    password: string;
  };
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "users".
 */
export interface User {
  id: string;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by \`Config\`'s JSON-Schema
 * via the \`definition\` "auth".
 */
export interface Auth {
  [k: string]: unknown;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}
          `
        }
      },
      'payload.config.ts': {
        file: {
          contents: `
// storage-adapter-import-placeholder
import { PGliteAdapter } from './_adapters' // database-adapter-import
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    }
  },
  collections: [Users, Media],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // database-adapter-config-start
  db: PGliteAdapter({ pool: { connectionString: 'memory://' }}),
  // database-adapter-config-end
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
          `
        }
      },
    }
  }
}

import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'

export const theme = createTheme({
  theme: 'light',
  settings: {
    background: '#141414',
    backgroundImage: '',
    foreground: '#fff',
    caret: '#fff',
    selection: '#f4fc4f50',
    selectionMatch: '#036dd626',
    lineHighlight: '#ffffff00',
    gutterBackground: '#141414',
    gutterForeground: '#656565',
    gutterBorder: '#ffffff00'
  },
  styles: [
    { tag: t.comment, color: '#8b949e' },
    { tag: [t.variableName, t.operator, t.function(t.punctuation)], color: '#61afef' },
    { tag: [t.string, t.special(t.brace)], color: '#808080' },
    { tag: t.number, color: '#5c6166' },
    { tag: t.bool, color: '#5c6166' },
    { tag: t.null, color: '#5c6166' },
    { tag: [t.keyword, t.controlKeyword], color: '#ff7b72' },
    { tag: t.className, color: '#5c6166' },
    { tag: t.definition(t.typeName), color: '#5c6166' },
    { tag: t.typeName, color: '#e5c07b' },
    { tag: t.angleBracket, color: '#5c6166' },
    { tag: t.tagName, color: '#5c6166' },
    { tag: t.attributeName, color: '#5c6166' },
    { tag: t.string, color: '#8cc4ff' },
    { tag: t.bracket, color: '#808080' },
    { tag: t.typeOperator, color: '#80bfd7' },
    { tag: [t.function(t.definition(t.variableName)), t.function(t.variableName)], color: '#d2a8ff' }
  ],
})

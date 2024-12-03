export const defaultCode = `
const a = "hello world!"

export const MyComp = () => {
// this is a comment
const [hello, world] = useState(123)

const myFunc = () => {
  console.log('this is a function')
  return {
    valueA: true,
    valueB: () => null,
    valueC: [1, 2, 3]
  }
}

return (
    <div>
      This is some text
    </div>
  )
}\n
`.trim()

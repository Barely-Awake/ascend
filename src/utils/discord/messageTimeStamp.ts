type ValidStyles = 't' | 'T' | 'd' | 'D' | 'f' | 'F' | 'R'

export default function (timeStamp: number, style: ValidStyles = 'f') {
  return `<t:${timeStamp}:${style}>`;
}
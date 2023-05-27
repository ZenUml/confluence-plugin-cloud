import * as React from 'react'

interface Props {
  children: React.ReactChildren
}

export function Toolbar({ children }: Props) {
  return <div>{children}</div>
}

/* @flow */
import React, { Component } from 'react'

export default (
  keymaps: (
    props: any,
  ) => Array<{
    keyCode?: number,
    keyCodes?: Array<number>,
    handler: Function,
    shiftKey?: boolean,
    altKey?: boolean,
    ctrlKey?: boolean,
    force?: boolean,
  }>,
) => (ComposedComponent: any) =>
  class KeyBind extends Component<{
    bound: ?Function,
    type: string,
  }> {
    bound = null
    type = 'keydown'

    componentDidMount() {
      this.bound = (event: SyntheticInputEvent<*>) => {
        const tagName = event.target.tagName.toLowerCase()
        keymaps(this.props).forEach(keymap => {
          if (
            !keymap.force &&
            (tagName === 'input' ||
              tagName === 'textarea' ||
              tagName === 'select')
          )
            return
          if (
            keymap.keyCode &&
            event.shiftKey === keymap.shiftKey &&
            event.keyCode === keymap.keyCode
          ) {
            keymap.handler(event)
          }
          if (keymap.keyCodes) {
            keymap.keyCodes.forEach(keyCode => {
              if (
                event.shiftKey === keymap.shiftKey &&
                event.keyCode === keyCode
              ) {
                keymap.handler(event)
              }
            })
          }
        })
      }
      window.addEventListener(this.type, this.bound)
    }

    componentWillUnmount() {
      window.removeEventListener(this.type, this.bound)
      this.bound = null
    }

    render() {
      return <ComposedComponent {...this.props} />
    }
  }

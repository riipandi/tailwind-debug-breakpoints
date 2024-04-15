import twTheme from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'
import type { ResolvableTo, ScreensConfig } from 'tailwindcss/types/config'

type ScreenEntry = [screen: string, size: string]

/**
 * A Tailwind CSS plugin that display the currently active screen (responsive breakpoint).
 *
 * Based on https://github.com/maxzz/tailwindcss-plugin-debug-breakpointss
 * Usage: add class 'debug-breakpoints' on body element
 *
 */

const debugScreensPlugin = plugin(
  function ({ addComponents, theme }) {
    const screens = (theme('screens') || {}) as ResolvableTo<ScreensConfig>
    const userStyles = theme('debugScreens.style', {})
    const ignoredScreens = theme('debugScreens.ignore', ['dark'])
    const prefix = theme('debugScreens.prefix', 'screen: ')
    const selector = theme('debugScreens.selector', '.debug-breakpoints')
    const printSize = theme('debugScreens.printSize', true)

    const defaultPosition = ['bottom', 'left']
    const position = theme('debugScreens.position', defaultPosition)
    const positionY = position[0] || defaultPosition[0]
    const positionX = position[1] || defaultPosition[1]
    const paddingY = theme('debugScreens.paddingY', '0px')
    const paddingX = theme('debugScreens.paddingX', '0px')

    const borderTopLeftRadius = theme('debugScreens.borderTopLeftRadius', '0px')
    const borderTopRightRadius = theme(
      'debugScreens.borderTopRightRadius',
      '0px'
    )
    const borderBottomLeftRadius = theme(
      'debugScreens.borderBottomLeftRadius',
      '0px'
    )
    const borderBottomRightRadius = theme(
      'debugScreens.borderBottomRightRadius',
      '0px'
    )

    const fontSize = theme('debugScreens.fontSize', '0.7em')
    const backgroundColor = theme('debugScreens.backgroundColor', '#131115')
    const color = theme('debugScreens.color', '#ffffff')

    const screenEntries = sortScreenEntries(screens).filter(
      ([screen]) => !ignoredScreens.includes(screen)
    )
    if (!screenEntries.length) {
      return
    }
    const lowestScreenName = screenEntries[0][0]
    const lowestScreenSize = printSize ? `(${screenEntries[0][1]})` : ''

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const components: Record<string, any> = {
      [`${selector}::before`]: Object.assign(
        {
          zIndex: '2147483647',
          position: 'fixed',
          [positionX]: paddingX,
          [positionY]: paddingY,
          padding: '.60em',
          fontSize: fontSize,
          lineHeight: '0.8',
          fontFamily: 'sans-serif',
          backgroundColor: backgroundColor,
          color: color,
          opacity: '0.8',
          border: 'none',
          borderTopLeftRadius: borderTopLeftRadius,
          borderTopRightRadius: borderTopRightRadius,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderBottomRightRadius: borderBottomRightRadius,
          boxShadow: '0 0 2px 2px #fff5',
          content: `'${prefix}less then ${lowestScreenName} ${lowestScreenSize}'`,
        },
        userStyles
      ),
    }

    screenEntries.forEach(([screen, size]) => {
      const printScreenSize = printSize ? ` (${size})` : ''
      components[`@screen ${screen}`] = {
        [`${selector}::before`]: {
          content: `'${prefix}${screen}${printScreenSize}'`,
        },
      }
    })

    addComponents(components)
  },
  {
    theme: {
      screens: {
        xsm: '501px', // Chrome minimum screen size is 500px
        ...twTheme.screens,
      },
    },
  }
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortScreenEntries(screens: any): ScreenEntry[] {
  const normalized = normalizeScreens(screens)
  const newScreens = extractScreenValues(normalized)
  newScreens.sort((a, b) => parseInt(a[1]) - parseInt(b[1]))
  return newScreens

  type NormalizeScreenValue = {
    min: string
    max: string | undefined
    raw?: string
  }

  type NormalizeScreen = {
    name: string
    not: boolean
    values: NormalizeScreenValue[]
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function normalizeScreens(screens: any, root = true): NormalizeScreen[] {
    if (Array.isArray(screens)) {
      return screens.map((screen) => {
        if (root && Array.isArray(screen)) {
          throw new Error('The tuple syntax is not supported for `screens`.')
        }

        if (typeof screen === 'string') {
          return {
            name: screen.toString(),
            not: false,
            values: [{ min: screen, max: undefined }],
          }
        }

        // eslint-disable-next-line prefer-const
        let [name, options] = screen
        name = name.toString()

        if (typeof options === 'string') {
          return {
            name,
            not: false,
            values: [{ min: options, max: undefined }],
          }
        }

        if (Array.isArray(options)) {
          return {
            name,
            not: false,
            values: options.map((option) => resolveValue(option)),
          }
        }

        return { name, not: false, values: [resolveValue(options)] }
      })
    }

    return normalizeScreens(Object.entries(screens ?? {}), false)

    function resolveValue({
      'min-width': _minWidth,
      min = _minWidth,
      max,
      raw,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any): NormalizeScreenValue {
      return { min, max, raw }
    }
  }

  function extractScreenValues(breakpoints: NormalizeScreen[] = []) {
    return breakpoints
      .flatMap((breakpoint) =>
        breakpoint.values.map((brk) => [breakpoint.name, brk.min])
      )
      .filter((v) => v !== undefined) as ScreenEntry[]
  }
}

export default debugScreensPlugin

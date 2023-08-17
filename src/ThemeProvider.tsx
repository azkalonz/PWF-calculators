import { MantineProvider, MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    orange: [
      "#F6F4F1",
      "#E8DED3",
      "#DDCAB5",
      "#D9B895",
      "#DAA872",
      "#E3994B",
      "#F58C1E",
      "#D67E21",
      "#B1712E",
      "#936535",
    ]
  },
  primaryColor: 'orange',
  fontFamily: 'Libre Franklin',
  components: {
    Stack: {
      styles: {
        root: {
          'h6': {
            color: '#909090'
          },
          'h1': {
            color: '#C22C3A',
            fontWeight: 500
          }
        }
      }
    },
    InputWrapper: {
      styles: {
        label: {
          color: '#909090',
          fontWeight: 700,
          marginBottom: '15px'
        }
      }
    },
    Title: {
      styles: {
        root: {
          '&.section-title': {
            color: '#BE1E2D',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: '15px',
            marginBottom: '20px'
          }
        }
      }
    }
  }
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      {children}
    </MantineProvider>
  );
}

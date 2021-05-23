import { Box } from 'rebass';
import { ThemeProvider } from 'emotion-theming';

export const boxWrapper: React.FC = ({ children }) => {
  return (
    <ThemeProvider
      theme={{
        colors: {
          background: 'black',
          primary: 'tomato',
          disconnect: '#bbb',
        },
        space: [0, 6, 12, 24, 48],
        fontSizes: [14, 16, 18, 20, 24],
        radii: {
          default: 5,
        },
      }}
    >
      <Box
        as="form"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        py={3}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
};

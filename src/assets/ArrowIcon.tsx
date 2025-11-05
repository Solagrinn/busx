import { Box } from '@mui/material'

interface DropdownArrowButtonProps {
  onClick: () => void
  size: number
  ariaLabel: string
}

export default function ArrowIcon({ onClick, size, ariaLabel }: DropdownArrowButtonProps) {
  const ArrowIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size - 16}
      height={size - 16}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  )

  return (
    <Box
      onClick={onClick}
      aria-label={ariaLabel}
      component="button"
      sx={{
        'display': 'flex',
        'alignItems': 'center',
        'justifyContent': 'center',
        'padding': '8px',
        'borderRadius': '50%',
        'cursor': 'pointer',
        'border': 'none',
        'background': 'none',

        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
    >
      {ArrowIcon}
    </Box>
  )
}

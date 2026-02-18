# @unified-api/react-authentication

React component for Unified API authentication / SSO. This component provides a seamless OAuth authentication experience for various providers through the Unified API platform.

## Installation

Using npm:
```bash
npm install @unified-api/react-authentication
```

Using yarn:
```bash
yarn add @unified-api/react-authentication
```

## Usage

```tsx
import React from 'react';
import UnifiedAuthentication from '@unified-api/react-authentication';

function App() {
  const handleSuccess = (data) => {
    console.log('Authentication successful:', data);
  };

  const handleFailure = (error) => {
    console.error('Authentication failed:', error);
  };

  return (
    <div>
      <UnifiedAuthentication
        workspace_id="your-workspace-id"
        title="Connect your accounts"
        description="Choose a service to authenticate with"
        onSuccess={handleSuccess}
        onFailure={handleFailure}
      />
    </div>
  );
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `workspace_id` | `string` | **Required.** Your Unified API workspace ID for authentication |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dc` | `'us' \| 'eu' \| 'au'` | `'us'` | Data center region for API calls |
| `environment` | `string` | `undefined` | Environment setting for the authentication flow |
| `title` | `string` | `undefined` | Title displayed above authentication options |
| `description` | `string` | `undefined` | Description text displayed below the title |
| `success_url` | `string` | `window.location.href` | URL to redirect to after successful authentication |
| `failure_url` | `string` | `window.location.href` | URL to redirect to after failed authentication |
| `state` | `string` | `undefined` | State parameter that will be returned to success/failure URLs |
| `pretext` | `string` | `'Sign in with'` | Prefix text for authentication buttons (e.g., "Continue with", "Login via") |
| `include_text` | `boolean` | `true` | Whether to display text labels on authentication buttons |
| `include_logo` | `boolean` | `true` | Whether to display provider logos on authentication buttons |
| `className` | `string` | `''` | Custom CSS class name for the component container |
| `style` | `React.CSSProperties` | `undefined` | Inline styles for the component container |
| `onSuccess` | `(data: { name?: string; emails?: string[] }) => void` | `undefined` | Callback function called when authentication succeeds |
| `onFailure` | `(error: Error) => void` | `undefined` | Callback function called when authentication fails |

## Examples

### Basic Usage
```tsx
<UnifiedAuthentication workspace_id="ws_1234567890" />
```

### With Custom Title and Description
```tsx
<UnifiedAuthentication
  workspace_id="ws_1234567890"
  title="Connect Your Account"
  description="Link your external accounts to sync data"
  pretext="Continue with"
/>
```

### With Success/Failure Callbacks
```tsx
<UnifiedAuthentication
  workspace_id="ws_1234567890"
  onSuccess={(data) => {
    console.log('User authenticated:', data.name, data.emails);
    // Handle successful authentication
  }}
  onFailure={(error) => {
    console.error('Authentication failed:', error.message);
    // Handle authentication failure
  }}
/>
```

### Custom Styling
```tsx
<UnifiedAuthentication
  workspace_id="ws_1234567890"
  className="my-auth-component"
  style={{ 
    maxWidth: '300px',
    padding: '24px',
    border: '1px solid #e1e5e9',
    borderRadius: '12px'
  }}
/>
```

### Different Data Center
```tsx
<UnifiedAuthentication
  workspace_id="ws_1234567890"
  dc="eu"  // Use European data center
/>
```

### Minimal Button Style
```tsx
<UnifiedAuthentication
  workspace_id="ws_1234567890"
  include_text={false}  // Only show icons/logos
  pretext=""
/>
```

### With Custom URLs
```tsx
<UnifiedAuthentication
  workspace_id="ws_1234567890"
  success_url="https://myapp.com/auth/success"
  failure_url="https://myapp.com/auth/error"
  state="custom_state_data"
/>
```

## Authentication Flow

1. Component fetches available authentication providers from Unified API
2. User clicks on a provider button
3. User is redirected to the provider's OAuth flow
4. After authentication, user is redirected back to your `success_url` or `failure_url`
5. On success, a JWT token containing user info is included in the URL parameters
6. The `onSuccess` callback is triggered with decoded user data

## Styling

The component includes default styles that work well out of the box, with support for both light and dark modes. You can customize the appearance using:

- CSS classes (see the component's CSS for available class names)
- The `className` prop for container-level styling
- The `style` prop for inline styles
- CSS custom properties for theme customization

### CSS Classes

- `.unified-authentication` - Main container
- `.unified-auth-title` - Title element
- `.unified-auth-description` - Description text
- `.unified-auth-providers` - Provider buttons container
- `.unified-auth-button` - Individual provider buttons
- `.unified-auth-icon` - Provider icons/logos
- `.unified-auth-text` - Button text
- `.unified-auth-loading` - Loading state container
- `.unified-auth-error` - Error state container

## TypeScript

This package includes TypeScript definitions. All props are fully typed, and the component exports its prop types:

```tsx
import UnifiedAuthentication, { 
  UnifiedAuthenticationProps,
  DataCenter 
} from '@unified-api/react-authentication';
```

## Requirements

- React 16.8.0 or higher
- Modern browser with fetch API support

## License

MIT

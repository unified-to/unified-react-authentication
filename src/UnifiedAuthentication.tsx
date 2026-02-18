import React, { useState, useEffect } from 'react';

// Define the data center type
export type DataCenter = 'us' | 'eu' | 'au';

// Define the props interface
export interface UnifiedAuthenticationProps {
  /** Required workspace ID for authentication */
  workspace_id: string;
  
  /** Data center region - defaults to 'us' */
  dc?: DataCenter;
  
  /** Environment setting */
  environment?: string;
  
  /** Title displayed above authentication options */
  title?: string;
  
  /** Description displayed below title */
  description?: string;
  
  /** Success redirect URL - defaults to current location */
  success_url?: string;
  
  /** Failure redirect URL - defaults to current location */
  failure_url?: string;
  
  /** State parameter returned to success/failure URLs */
  state?: string;
  
  /** Prefix text for login buttons (e.g., "Sign in with") */
  pretext?: string;
  
  /** Whether to include text in buttons - defaults to true */
  include_text?: boolean;
  
  /** Whether to include icons in buttons - defaults to true */
  include_icon?: boolean;
  
  /** Custom CSS class name */
  className?: string;
  
  /** Custom styles */
  style?: React.CSSProperties;
  
  /** Callback fired on authentication success */
  onSuccess?: (data: { name?: string; emails?: string[] }) => void;
  
  /** Callback fired on authentication failure */
  onFailure?: (error: Error) => void;
}

// Provider interface
interface AuthProvider {
  type: string;
  name: string;
  logo_url: string;
}

const UnifiedAuthentication: React.FC<UnifiedAuthenticationProps> = ({
  workspace_id,
  dc = 'us',
  environment,
  title,
  description,
  success_url,
  failure_url,
  state,
  pretext = 'Sign in with',
  include_text = true,
  include_icon = true,
  className = '',
  style,
  onSuccess,
  onFailure,
}) => {
  const [providers, setProviders] = useState<AuthProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the base URL for the Unified API
  const getBaseUrl = () => {
    const dcMap = {
      us: 'https://unified.to',
      eu: 'https://eu.unified.to',
      au: 'https://au.unified.to',
    };
    return dcMap[dc];
  };

  // Fetch available providers
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/unified/integration/workspace/${workspace_id}?categories=auth&summary=true&active=true`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch providers: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProviders(data.providers || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load authentication providers';
        setError(errorMessage);
        if (onFailure) {
          onFailure(new Error(errorMessage));
        }
      } finally {
        setLoading(false);
      }
    };

    if (workspace_id) {
      fetchProviders();
    }
  }, [workspace_id, dc, onFailure]);

  // Handle authentication
  const handleAuthentication = (providerId: string) => {
    try {
      const baseUrl = getBaseUrl();
      const params = new URLSearchParams({
        workspace_id,
        provider: providerId,
        success_url: success_url || window.location.href,
        failure_url: failure_url || window.location.href,
        ...(state && { state }),
        ...(environment && { environment }),
      });

      const authUrl = `${baseUrl}/auth/login?${params.toString()}`;
      
      // Redirect to authentication URL
      window.location.href = authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      if (onFailure) {
        onFailure(new Error(errorMessage));
      }
    }
  };

  // Handle JWT token from URL (for success callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('jwt');
    
    if (jwt && onSuccess) {
      try {
        // Decode JWT payload (note: this is basic decoding, not verification)
        const payload = JSON.parse(atob(jwt.split('.')[1]));
        onSuccess({
          name: payload.name,
          emails: payload.emails,
        });
      } catch (err) {
        console.warn('Failed to decode JWT token:', err);
      }
    }
  }, [onSuccess]);

  if (loading) {
    return (
      <div className={`unified-auth-loading ${className}`} style={style}>
        <div className="unified-auth-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`unified-auth-error ${className}`} style={style}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`unified-authentication ${className}`} style={style}>
      {title && <h2 className="unified-auth-title">{title}</h2>}
      {description && <p className="unified-auth-description">{description}</p>}
      
      <div className="unified-auth-providers">
        {providers.map((provider) => (
          <button
            key={provider.id}
            className="unified-auth-button"
            onClick={() => handleAuthentication(provider.id)}
            disabled={!provider.enabled}
            type="button"
          >
            {include_icon && provider.icon && (
              <span 
                className="unified-auth-icon"
                dangerouslySetInnerHTML={{ __html: provider.icon }}
              />
            )}
            {include_text && (
              <span className="unified-auth-text">
                {pretext} {provider.name}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {providers.length === 0 && (
        <p className="unified-auth-no-providers">
          No authentication providers available.
        </p>
      )}
    </div>
  );
};

export default UnifiedAuthentication;


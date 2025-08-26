# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability, please follow these steps:

### Private Disclosure

1. **Do NOT** create a public GitHub issue for security vulnerabilities
2. Use GitHub's private vulnerability reporting feature
3. Or email security concerns to the maintainers (if email is available)

### What to Include

Please provide as much information as possible:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Reproduction**: Step-by-step instructions to reproduce
- **Environment**: Affected versions and configurations
- **Mitigation**: Any temporary workarounds you've identified

### Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Status Updates**: Weekly until resolved
- **Resolution**: Target within 30 days for critical issues

### Disclosure Policy

- We will work with you to understand and resolve the issue
- We will credit you in the security advisory (unless you prefer anonymity)
- We will coordinate public disclosure after the fix is available
- We ask that you do not publicly disclose until we've had a chance to address the issue

## Security Considerations

### Data Handling
- No personal data is stored permanently
- Analysis results are not logged or retained
- All processing happens in real-time without persistence

### API Security
- Rate limiting implemented on all endpoints
- Input validation and sanitization
- No authentication required (public analysis service)

### Infrastructure
- Deployed on Vercel with security best practices
- HTTPS enforced for all connections
- Regular dependency updates for security patches

## Best Practices for Contributors

### Code Security
- Validate all user inputs
- Sanitize data before processing
- Use TypeScript for type safety
- Follow secure coding practices

### Dependencies
- Keep dependencies updated
- Review security advisories
- Use npm audit to check for vulnerabilities
- Prefer well-maintained packages

### Sensitive Information
- Never commit API keys or secrets
- Use environment variables for configuration
- Review code for accidental information disclosure

## Contact

For security-related questions or concerns, please use GitHub's private vulnerability reporting or contact @AyushSingh360 through appropriate channels.

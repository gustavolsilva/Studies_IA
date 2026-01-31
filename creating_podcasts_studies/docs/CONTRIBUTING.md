# Contributing Guide

## Development Setup

1. Clone the repository
2. Create virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

## Code Standards

### Style Guide
- Follow PEP 8
- Use type hints
- Write docstrings for all functions

### Documentation
```python
def function_name(param1: str, param2: int) -> bool:
    """
    Brief description.

    Args:
        param1: Description of param1
        param2: Description of param2

    Returns:
        Description of return value
    """
```

### Testing
- Write tests for new features
- Run tests before committing:
  ```bash
  python main.py test
  ```

## Commit Messages

Format: `[TYPE] Description`

Types:
- `[FEAT]` - New feature
- `[FIX]` - Bug fix
- `[DOCS]` - Documentation
- `[REFACTOR]` - Code refactoring
- `[TEST]` - Tests

Example:
```
[FEAT] Add voice customization option
[FIX] Fix chapter numbering issue
[DOCS] Update API documentation
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit
3. Run tests: `python main.py test`
4. Push to branch
5. Create pull request with description

## Reporting Issues

Include:
1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Environment details

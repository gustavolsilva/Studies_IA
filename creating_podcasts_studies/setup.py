"""
Setup script for Podcast Generator.

Install with:
    pip install -e .
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="podcast-generator",
    version="1.0.0",
    author="Podcast Generator Team",
    description="Generate educational podcasts from markdown content",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/podcast-generator",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.13",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Development Status :: 4 - Beta",
        "Environment :: Console",
        "Intended Audience :: Education",
        "Topic :: Multimedia :: Sound/Audio",
    ],
    python_requires=">=3.7",
    install_requires=[
        "pyttsx3>=2.90",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-cov>=3.0",
            "black>=22.0",
            "flake8>=4.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "podcast-generator=main:main",
        ],
    },
)

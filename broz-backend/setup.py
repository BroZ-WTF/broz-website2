from setuptools import find_packages, setup

setup(
    name='wsgibackend',
    version='1.2.6',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=['flask', 'flask_cors'],
)
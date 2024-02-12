from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in techchallengeapp/__init__.py
from techchallengeapp import __version__ as version

setup(
	name="techchallengeapp",
	version=version,
	description="TechChallengeApp",
	author="Ahmed Reda Abd El-Sattar",
	author_email="ahmedreda.abdelsattar@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)

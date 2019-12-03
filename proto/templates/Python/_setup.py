import setuptools
import sys
import os

with open("version.txt", "r") as fh:
    version_str = fh.read()

the_lib_folder = os.path.dirname(os.path.realpath(__file__))
requirement_path = the_lib_folder + '/requirements_for_package.txt'
install_requires = [] # Examples: ["gunicorn", "docutils>=0.3", "lxml==0.5a7"]
if os.path.isfile(requirement_path):
    with open(requirement_path) as f:
        install_requires = f.read().splitlines()

setuptools.setup(
    name="broadcast_<%= package %>",
    version=version_str,
    packages=setuptools.find_packages(),    
    python_requires='>=3.6',
    install_requires=install_requires,
)
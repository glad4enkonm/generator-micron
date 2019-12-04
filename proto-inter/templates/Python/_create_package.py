import os

# Create gRPC classes
os.system('python -m grpc_tools.protoc --proto_path=../ ../<%= package %>.proto --python_out=./broadcast-<%= package %> --grpc_python_out=./broadcast-<%= package %>')

# Create a python package
os.system('python setup.py sdist bdist_wheel')
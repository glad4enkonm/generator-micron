const { execSync, exec } = require('child_process');
const chalk = require('chalk');

function formated_exec_sync(command) {
    console.log("exec->" + command);
    execSync(command, {stdio: 'inherit'});
}

function formated_exec(command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`exec error: ${error}`));
          console.error(chalk.red(`stderr: ${stderr}`));
          return;
        }
        console.log(chalk.green(`stdout: ${stdout}`));        
      });
}

function new_solution(name) {
    formated_exec_sync(`dotnet new sln --name ${name}`);
}

function new_console_project(name) {
    formated_exec_sync(`dotnet new console -lang "C#" --name ${name}`);
}

function add_project_to_solution(project_name, solution_name) {
    formated_exec_sync(`dotnet sln ${solution_name}.sln add ${project_name}`);
}

function build_project(project_name) {
    formated_exec_sync(`dotnet build ${project_name}`);
}

function add_package_to_project(package, project, version = null) {
    let command = `dotnet add ${project} package`;
    if (version != null)
        command += ` --version ${version}`;
    command += ` ${package}`
    formated_exec_sync(command);
}

module.exports = {
    new_solution,
    new_console_project,
    add_project_to_solution,
    add_package_to_project,
    build_project
}
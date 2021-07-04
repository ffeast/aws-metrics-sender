# aws-metrics-sender

This is a script that listens on the metrics files and sends added metrics to AWS Cloudwatch.

And yes, it's Windows-compatible


## Installation on Linux/Mac

1. install [nodejs](https://nodejs.org/en/download/)
2.  `npm i -g aws-metrics-sender`
3.  `aws-metrics-sender` command should be available now


## Installation on Windows
I'm not a big fan of Windows OS and it's quite likely that the following steps can be further simplified, but I ended up with the following working procedure to have aws-metrics-sender running as a windows service
1. install [nodejs](https://nodejs.org/en/download/). There's an `.msi` available so the installation is fairly straightforward
2. create a directory `C:\aws-metrics-sender` or any other directory convenient for you
3. `cd dir` where `dir` is the the directory from step 2.
4. `npm i aws-metrics-sender`
5. `npm i -g node-windows`
6. put `agent-service.js` to . ([example](https://github.com/ffeast/aws-metrics-sender/blob/master/examples/agent-service.js))
7. configure paths, aws creds etc
8. `node agent-service.js install`

If all went smoothly you'd see a new service **aws-metrics-sender** in the windows services:
![](images/services_list.png)

Here it is:  
![](images/service_box.png)

It's also recommended to configure script restarts:
![](images/recovery_screen.png)

If something goes wrong you can check out log files in the `node_modules\aws-metrics-sender\daemon` folder

To uninstall the service just run
`node agent-service.js uninstall`

var winston = require("winston");//로그 처리 모듈
var winstonDaily = require("winston-daily-rotate-file");//로그 일별처리 모듈

var logger = winston.createLogger({
	
	//debug: 0-> info:1->notis:2->warning:3 -> error:4 -> crit:5->alert:6->emerg:7
	
	level:"debug",
	format: winston.format.simple(),
	transports: [
	             new (winston.transports.Console)({
	            	 colorize: true}), 
	             new (winstonDaily)({
	            	 filename: './log/server_%DATE%.log',
	            	 maxSize:"10m",
	            	 datePattern: 'YYYY-MM-DD HH-mm-ss'
	             })
	            ]
});



				var fs = require("fs");
				
				var inName = "./output.txt";
				var outName = "./output4.txt";
				
				fs.exists(outName,function(fileName){
					
					if(fileName){
						fs.unlink(outName,function(err){
							
							if(err) throw err;
							
							logger.info(outName + "삭제할거야")
						})
						return;
					}
					var inFile = fs.createReadStream(inName,{flags:"r"});
					var outFile = fs.createWriteStream(outName,{flags: "w"});
					
					inFile.pipe(outFile);
					
					logger.info("파일 복사했다.");
				});
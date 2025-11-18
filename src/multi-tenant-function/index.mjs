import fs from 'fs';
let memoryCounter = 0;
const DISK_COUNTER_FILE_NAME = '/tmp/counter.txt';

export const handler = async (event, ctx) => {
  const tenantId = ctx.tenantId;
  console.log(`tenantId=${tenantId}`);

  let memoryCounter = getMemoryCounter();  
  console.log(`memoryCounter=${memoryCounter}`); 
  memoryCounter++;
  setMemoryCounter(memoryCounter); 

  let diskCounter = getDiskCounter();
  console.log(`diskCounter=${diskCounter}`); 
  diskCounter++;
  setDiskCounter(diskCounter);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      memoryCounter, diskCounter, tenantId
    }),
  };
};

function getMemoryCounter(){
  return memoryCounter;
}

function setMemoryCounter(value){
  memoryCounter = value;
}

function getDiskCounter(){
  checkFileExists();
  const diskCounterFileText = fs.readFileSync(DISK_COUNTER_FILE_NAME, 'utf8');  
  let diskCounter = parseInt(diskCounterFileText);
  return diskCounter;
}

function setDiskCounter(value){
  fs.writeFileSync(DISK_COUNTER_FILE_NAME, value.toString());
}

function checkFileExists(){
    if (!fs.existsSync(DISK_COUNTER_FILE_NAME)) {
    console.log(`creating new ${DISK_COUNTER_FILE_NAME}`)
    fs.writeFileSync(DISK_COUNTER_FILE_NAME, '0');
  }
}
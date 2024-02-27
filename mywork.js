const Message = require('./message.js');
const Command = require('./command.js')

class Rover {
   constructor(position) {
      this.position = position;
      this.mode = 'NORMAL';
      this.generatorWatts = 110;
   }

   receiveMessage(theMessage) {
      let message = theMessage.name;
      let results = [];

      for (let i=0; i < theMessage.commands.length; i++) {
         if (theMessage.commands[i].commandType === 'STATUS_CHECK') {
            results.push({completed: true, roverStatus: {mode: this.mode, generatorWatts: this.generatorWatts, position: this.position}});
         } else if (theMessage.commands[i].commandType === 'MODE_CHANGE') {
            results.push({completed: true});
            this.mode = theMessage.commands[i].value;
         } else if (theMessage.commands[i].commandType === 'MOVE') {
            if (this.mode === 'LOW_POWER') {
               results.push({completed: false}); 
            } else {
               results.push({completed: true});
               this.position = theMessage.commands[i].value;
            }
         }
      }
      return {message, results};
   }
}


module.exports = Rover;

let rover = new Rover(100);
    let commands = [
      //  new Command('MOVE', 4321),
      //  new Command('STATUS_CHECK'),
       new Command('MODE_CHANGE', 'LOW_POWER'),
      //  new Command('MOVE', 3579),
       new Command('STATUS_CHECK')
    ];
let message = new Message('TA power', commands);
    let response = rover.receiveMessage(message);
    console.log(response);
//     console.log(response.message) //.toEqual('TA power');
//     console.log(response.results[0]) //.completed).toBeTruthy();
//     console.log(response.results[1]) //.roverStatus.position).toEqual(4321);
//     console.log(response.results[2]) //.completed).toBeTruthy();
//     console.log(response.results[3])  //.completed).toBeFalsy();
//     console.log(response.results[4]) //.roverStatus.position).toEqual(4321);
//     console.log(response.results[4]) //.roverStatus.mode).toEqual('LOW_POWER');
//     console.log(response.results[4]) //.roverStatus.generatorWatts).toEqual(110);
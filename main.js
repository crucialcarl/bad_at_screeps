var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }


    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');


    console.log('Harvesters: ' + harvesters.length);
    console.log('Builders: ' + builders.length);
    console.log('Upgraders: ' + upgraders.length);


    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;        
        var result = Game.spawns['CHSpawn'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'harvester', harvest_target: 0}});
        if (result == 0) { 
            console.log('Spawning new harvester: ' + newName);
        } else { 
            console.log('Harvester Spawn Result: ' + result)
        }
    }
    
    if (builders.length < 2) {
        var newName = 'Builder' + Game.time;
        var result = Game.spawns['CHSpawn'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
        if (result == 0) { 
            console.log('Spawning new builder: ' + newName);
        } else { 
            console.log('Builder Spawn Result: ' + result)
        }
    }

    if(upgraders.length < 2) {
        var newName = 'Upgrader' + Game.time;
        var result = Game.spawns['CHSpawn'].spawnCreep([WORK,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
        if (result == 0) {
            console.log('Spawning new upgrader: ' + newName);
        } else { 
            console.log('Upgrader Spawn Result: ' + result)
        }
    }

    //if(Game.spawns['CHSpawn'].spawning) {
    //    var spawningCreep = Game.creeps[Game.spawns['CHSpawn'].spawning.name];  
    //}

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
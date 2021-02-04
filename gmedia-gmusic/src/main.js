/* global $$, Operation */

const easymidi = require('easymidi')
const { v4 } = require('uuid')

let MIDIInputDevices = []
let inputs = []

console.log('%c GMedia GMusic is running', 'color:#2e5200')

const checkForMIDIInputDevices = () => {
  MIDIInputDevices = easymidi.getInputs()
  const inp = []
  for (const device of MIDIInputDevices) {
    inp.push(new easymidi.Input(device))
  }
  inputs = inp
  dicb()
}

const noteonListener = (msg) => {
  const note = msg.note
  if (note === 49) {
    console.log('crash')
  } else if (note === 50) {
    console.log('tom')
  } else if (note === 51) {
    console.log('ride')
  } else if (note === 46) {
    console.log('hi-hat')
  } else if (note === 38) {
    console.log('snare')
  } else if (note === 45) {
    console.log('stand-tom')
  } else if (note === 36) {
    console.log('bass')
  } else {
    console.log(msg)
  }
}

const dicb = () => {
  for (const input of inputs) {
    input.on('noteon', noteonListener)
  }
}

checkForMIDIInputDevices()
setInterval(checkForMIDIInputDevices, 5000)

window.prompts = {}

function prompt (q, b = 'Ok') {
  const o = new Operation()
  const oid = v4() + v4() + v4()
  $$('.prompt-container').innerHTML += `
    <div class="prompt">
      <h2>${q}</h2>
      <input type="text" value="" />
      <button onclick="this.parentElement.outerHTML='';window.prompts['${oid}'].success(this.parentElement.querySelector('input').value);window.prompts['${oid}']=undefined">${b}</button>
    </div>
  `
  window.prompts[oid] = o
  return o
}
window.prompt = prompt

function newProject () {
  prompt('Name your project:').then(name => {
    console.log(name)
  })
}
window.newProject = newProject

function oldProject () {
  prompt('Name of the project:').then(name => {
    console.log(name)
  })
}
window.oldProject = oldProject

$$(document)(() => {
  // Main Menu
  $$('body').innerHTML += '<div class="main-menu">\n<div onclick="newProject()" class="option new-project" id="new-project">\n<h2>Create new Project</h2>\n<span class="under-option">Create a fresh project to make music</span>\n</div>\n<div class="option old-project" onclick="oldProject()" id="old-project">\n<h2>Open Project</h2>\n<span class="under-option">Open an existing project</span>\n</div>\n</div>'
})

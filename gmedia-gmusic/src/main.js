/* global $$, Operation */

const easymidi = require('easymidi')
const { v4 } = require('uuid')
const path = require('path')
const os = require('os')
const fs = require('fs')

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

const p = (v) => {
  v = v.replace(/\//g, '__slash__')
  v = v.replace(/\\/g, '__backslash__')
  v = v.replace(/:/g, '__doublepoint__')
  v = v.replace(/\*/g, '__times__')
  v = v.replace(/\?/g, '__qestionmark__')
  v = v.replace(/"/g, '__quote__')
  v = v.replace(/</g, '__sbracketleft__')
  v = v.replace(/>/g, '__sbracketright__')
  v = v.replace(/\|/g, '__highslash__')

  return v
}

const openproj = (name) => {
  const pa = path.join((os.platform() === 'win32' ? 'C:/Users/' : '/home/') + os.userInfo().username + '/', `/gmedia-gmusic/projects/${p(name)}`).replace(/\\/g, '/')
  window.pp = pa
  window.pn = name

  $$('body').innerHTML = `
    <div class="prompt-container"></div>
    <span style="display:none" id="pn">${name}</span>
    <div class="editing">
      <div class="top">
        <div class="toolc" id="toolc">
          <div class="tools" id="tools">

          </div>
          <div class="toolp" id="toolp">

          </div>
        </div>
        <div class="preview">
          
        </div>
      </div>
      <div class="bottom">
        <div class="timeline" id="timeline">

        </div>
      </div>
    </div>
  `
}

function newProject () {
  prompt('Name your project:').then(name => {
    let func = false
    try {
      fs.mkdirSync(path.join((os.platform() === 'win32' ? 'C:/Users/' : '/home/') + os.userInfo().username + '/', `/gmedia-gmusic/projects/${p(name)}`).replace(/\\/g, '/'))
      console.log('Creating Project: ' + name)
      func = true
    } catch {
      console.log('Opening Project: ' + name)
      openproj(name)
    }

    if (func) {
      fs.writeFileSync(path.join((os.platform() === 'win32' ? 'C:/Users/' : '/home/') + os.userInfo().username + '/', `/gmedia-gmusic/projects/${p(name)}/project.json`).replace(/\\/g, '/'), JSON.stringify({
        project: true,
        p: []
      }))
      fs.mkdirSync(path.join((os.platform() === 'win32' ? 'C:/Users/' : '/home/') + os.userInfo().username + '/', `/gmedia-gmusic/projects/${p(name)}/src`).replace(/\\/g, '/'))

      openproj(name)
    }
  })
}
window.newProject = newProject

function oldProject () {
  prompt('Name of the project:').then(name => {
    console.log('Opening Project: ' + name)
    openproj(name)
  })
}
window.oldProject = oldProject

$$(document)(() => {
  // Main Menu
  $$('body').innerHTML += '<div class="main-menu">\n<div onclick="newProject()" class="option new-project" id="new-project">\n<h2>Create new Project</h2>\n<span class="under-option">Create a fresh project to make music</span>\n</div>\n<div class="option old-project" onclick="oldProject()" id="old-project">\n<h2>Open Project</h2>\n<span class="under-option">Open an existing project</span>\n</div>\n</div>'
})

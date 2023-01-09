const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), and Electron (v${versions.electron()})`;
console.log(versions.chrome());

const func = async () => {
    const response = await window.versions.ping()
    console.log(response) // 打印 'pong'
}

const pingButton = document.getElementById('pingBtn');
pingButton.addEventListener('click',func);

const btn = document.getElementById('btn')
const filePathElement = document.getElementById('filePath')

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
  const jsonData = await window.electronAPI.getData(filePath)
  console.dir(jsonData)
})

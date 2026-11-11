// renderer.js
document.getElementById('btn').addEventListener('click', async () => {
//   const info = await window.api.getSystemInfo();
//   document.getElementById('output').textContent = JSON.stringify(info, null, 2);
//   const versionInfo = await window.api.getAppVersionInfo();
//   document.getElementById('versioninfo').textContent = JSON.stringify(versionInfo,null,2)
  const filesInfo = await window.api.getFiles();
  document.getElementById('files').textContent = JSON.stringify(filesInfo,null,2)
});
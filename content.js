console.log("Hi, I have been injected");

var recorder = null; //

function onAccessApproved(stream) {

    recorder = new MediaRecorder(stream);

    recorder.start();

    recorder.onstop = function() {
        stream.getTracks().forEach(function(track){
            if(track.readyState === "live"){
                track.stop()
            }
        })
    }

    
  let controlsContainer = document.createElement("div");
  controlsContainer.style.display = "flex";
  controlsContainer.style.gap = "1rem";
  controlsContainer.style.alignItems = "center";
  controlsContainer.style.minWidth = "400px";
  controlsContainer.style.backgroundColor = "#141414";
  controlsContainer.style.borderRadius = "100vh";
  controlsContainer.style.paddingBlock = "0.5rem";
  controlsContainer.style.justifyContent = "space-evenly";
  controlsContainer.style.position = "fixed";
  controlsContainer.style.bottom = "5%";
  controlsContainer.style.left = "5%";
  let time = document.createElement("div");
  let timeP = document.createElement("p");
  let timeSpan = document.createElement("span");
  time.style.display = "flex";
  time.style.alignItems = "center";
  time.style.gap = "1rem";
  timeP.style.fontWeight = "500";
  timeP.style.fontSize = "1.25rem";
  timeP.style.fontFamily = "Inter";
  timeP.style.color = "#fff";
  timeP.textContent = "00:03:35";
  timeSpan.style.height = "8px";
  timeSpan.style.width = "8px";
  timeSpan.style.backgroundColor = "red";
  timeSpan.style.borderRadius = "50%";
  time.appendChild(timeP);
  time.appendChild(timeSpan);
  controlsContainer.appendChild(time);
  let controlItemsContainer = document.createElement("div");
  controlItemsContainer.style.display = "flex";
  controlItemsContainer.style.alignItems = "center";
  controlItemsContainer.style.gap = "1rem";
  controlItemsContainer.style.borderLeft = "1px solid #E8E8E8";
  controlItemsContainer.style.paddingLeft = "1rem";
  document.body.appendChild(controlsContainer);
  const controlItem1 = createControlItem("Pause");
  const controlItem2 = createControlItem("Stop");
  const controlItem3 = createControlItem("Camera");
  controlItemsContainer.appendChild(controlItem1);
  controlItemsContainer.appendChild(controlItem2);
  controlItemsContainer.appendChild(controlItem3);
  function createControlItem(labelText) {
    const controlItem = document.createElement("div");
    //   controlItem.className = "controlItem";
    controlItem.style.display = "flex";
    controlItem.style.alignItems = "center";
    controlItem.style.gap = ".3rem";
    //   controlItem.style.paddingLeft = "1rem";
    controlItem.style.flexDirection = "column";
    const button = document.createElement("button");
    button.style.borderRadius = "50%";
    button.style.display = "grid";
    button.style.placeContent = "center";
    button.style.backgroundColor = "#fff";
    button.style.border = "none";
    button.style.height = "30px";
    button.style.width = "30px";
    const img = document.createElement("img");
    img.style.height = "15px";
    img.style.objectFit = "contain";
    img.src = "/icons/" + labelText.toLowerCase() + ".png";
    button.appendChild(img);
    const label = document.createElement("small");
    label.style.fontFamily = "Work Sans";
    label.style.fontWeight = "500";
    label.style.fontSize = "0.75rem";
    label.style.color = "#fff";
    label.textContent = labelText;
    controlItem.appendChild(button);
    controlItem.appendChild(label);
    return controlItem;
  }
  controlsContainer.appendChild(controlItemsContainer);

    recorder.ondataavailable = function(event) {

        
        // Assuming you have event.data as the Blob
        let recordedBlob = event.data;
        let url = URL.createObjectURL(recordedBlob);
        let apiUrl = "https://chrome-sxv4.onrender.com/videos/upload";

        fetch(apiUrl, {
            method: 'POST',
            body: url,
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json(); // Parse the response JSON if needed
            })
            .then(data => {
              console.log('API Response:', data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
        
        

        

        /* 

        let a = document.createElement("a");

        a.style.display = "none";

        a.href = url;

        a.download = "screen-recording.webm"; //

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url); */
    } 
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if(message.action === "request_recording"){
        console.log("requesting recording")

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio:true,
            video:{
               width: 9999999999,
               height: 9999999999
            }
        }).then((stream) => {
           onAccessApproved(stream)
        })

    }

    if(message.action === "stopvideo"){
       console.log("stopping video");
       sendResponse(`processed: ${message.action}`);

       if(!recorder) return console.log("no recorder")

       recorder.stop();
    }

})


/* chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'screenSharingStopped' && message.videoUrl) {
        const customRecordedVideosUrl = "https://hngxhelpmeout.netlify.app/?videoUrl=" + encodeURIComponent(message.videoUrl);
        chrome.tabs.create({ url: customRecordedVideosUrl });
    }
});

*/

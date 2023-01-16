import React, {useEffect, useState} from 'react';
import { Offline, Online } from "react-detect-offline";
import {Button} from 'react-bootstrap';
import iconIOS from "./images/upload.png";

export default function Home() {
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // For Android.
    let deferredPrompt; // Variable should be out of scope of addEventListener method
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();	// This prevents default chrome prompt from appearing
        deferredPrompt = e;	 // Save for later
        let infoBar = document.querySelector('#custom-info-bar');
        if (infoBar) {
          infoBar.style.display = '';
          let installBtn = document.querySelector('#custom-install-button');
          installBtn.addEventListener('click', (e) => {
            //This prompt window
            deferredPrompt.prompt();
            // Here we wait for user interaction
            deferredPrompt.userChoice
            .then((choiceResult) => {
              console.log(choiceResult);
              if (choiceResult.outcome === 'accepted') {
                let infoBar = document.querySelector('#custom-info-bar');
                infoBar.style.display = 'none'; // Hide info bar
                deferredPrompt = null; // not need anymore
              }
            });
          });
        }
    });

    // For IOS.
    // Detects if device is on iOS
    const isIosDevice = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod|macintosh/.test(userAgent);
    }

    // Detects if device is on iOS
    const isSafari = () => {
      return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
        navigator.userAgent &&
        navigator.userAgent.indexOf('CriOS') === -1 &&
        navigator.userAgent.indexOf('FxiOS') === -1;
    }

    if (isIosDevice() && isSafari()) {
      setIsIOS(true);
    }

  }, [setIsIOS, isIOS]);


  return (
    <div className='home-wrapper'>
      <div>
        <Online>
          <h1>Home Page</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla porttitor accumsan tincidunt. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Nulla porttitor accumsan tincidunt. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Vivamus suscipit tortor eget felis porttitor volutpat. Donec sollicitudin molestie malesuada.</p>

          <p>Vivamus suscipit tortor eget felis porttitor volutpat. Pellentesque in ipsum id orci porta dapibus. Vivamus suscipit tortor eget felis porttitor volutpat. Pellentesque in ipsum id orci porta dapibus. Nulla porttitor accumsan tincidunt. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.</p>

          <p>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Sed porttitor lectus nibh. Nulla porttitor accumsan tincidunt. Donec sollicitudin molestie malesuada. Curabitur aliquet quam id dui posuere blandit. Donec sollicitudin molestie malesuada. Donec sollicitudin molestie malesuada.</p>

          <p>Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh. Nulla quis lorem ut libero malesuada feugiat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Quisque velit nisi, pretium ut lacinia in, elementum id enim.</p>

          <p>Nulla porttitor accumsan tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula. Vivamus suscipit tortor eget felis porttitor volutpat. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.</p>

          <div className='only-mbl'>
            { isIOS ? (
              <div className='sticky-modal'>Install the app on your iPhone: tap <span style={{width: "16px", display: "inline-block"}}><img src={iconIOS} width="100%" alt="" /></span> and then Add to homescreen.</div>
            ) : (
              <>
              <div id='custom-info-bar'>
                <Button variant="dark" id='custom-install-button'>Install</Button>
              </div>
              </>
            )}
          </div>
        </Online>
        <Offline>
          <h1>Oops! You seem to be offline.</h1>
          <p>You need to have a internet conection to view this page.</p>
          <button id="reload" onClick={() => window.location.reload(false)}> Reload</button>
        </Offline>
      </div>

    </div>
  )
}
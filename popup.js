async function initializeSidePanel() {
  let container = document.getElementById("iframe")
  let settingBtn = document.getElementsByClassName("setting")[0]

  let authState, message

  // Check if access token exists in storage
  if (localStorage.getItem("accessToken")) {
    authState = "authorized"
  } else {
    try {
      let response = await fetch("https://chat.openai.com/api/auth/session")

      if (response.status === 403) {
        authState = "cloudflare"
        message =
          'Please login and pass Cloudflare check at <a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a>'
      } else if (!response.ok || !(await response.json()).accessToken) {
        authState = "unauthorized"
        message =
          'Please login at <a href="https://chat.openai.com" target="_blank" rel="noreferrer">chat.openai.com</a> first'
      } else {
        authState = "authorized"
      }
    } catch (error) {
      console.error("Error fetching session", error)
      // Handle error appropriately, possibly setting authState and message to reflect an error state
    }
  }

  if (authState === "authorized") {
    container.innerHTML =
      '<iframe scrolling="no" src="https://chat.openai.com/chat" frameborder="0" style="width: 100%; height:100vh;"></iframe>'
  } else {
    container.innerHTML = `
              <div class="extension-body">
                <div class="notice">
                    <!-- Your SVG here -->
                    <div>${message}</div>
                </div>
              </div>`
  }

  //   settingBtn.onclick = function () {
  //     chrome.runtime.sendMessage({ type: "OPEN_OPTIONS_PAGE" })
  //   }
}

initializeSidePanel()

var transposingtales = {
    apiKey: "AIzaSyCoBAzdCizF7QArpX3aypTuPwOBVAoezCs",
    authDomain: "transposingtales.firebaseapp.com",
    databaseURL: "https://transposingtales-default-rtdb.firebaseio.com",
    projectId: "transposingtales",
    storageBucket: "transposingtales.appspot.com",
    messagingSenderId: "879161277893",
    appId: "1:879161277893:web:082500f42be8ab44101fac",
    measurementId: "G-LX9KNC8HBF"
};

firebase.initializeApp(transposingtales);
const database = firebase.database();
const storage = firebase.storage();






// To Fetch & Display The User's Search History !!!!

function getUserSearchHistory() {
    const phoneOfUser = localStorage.getItem('phoneofuser');
    if (phoneOfUser) {
      const userRef = database.ref('users/' + phoneOfUser + '/searchHistory');
      userRef.once('value')
        .then(snapshot => {
          const searchHistory = snapshot.val();
          if (searchHistory) {
            const searchHistoryDiv = document.querySelector('.searchhistory');
            // Clear previous content
            // searchHistoryDiv.innerHTML = '';
  
            // Display search history
            Object.values(searchHistory).forEach(history => {
              const timestamp = new Date(history.timestamp);
              const query = history.query;
              const historyItem = document.createElement('p');
              historyItem.textContent = ' • ' + timestamp.toLocaleString() + ' : ' + query;
              searchHistoryDiv.appendChild(historyItem);
            });
          } else {
            console.log('No search history found for this user.');
          }
        })
        .catch(error => {
          console.error('Error fetching search history:', error);
        });
    } else {
      console.error('Phone number not found in local storage');
    }
  }
  
  getUserSearchHistory();













// Function to record user's search history in Firebase DB
function recordSearchHistory(query) {
    const phoneOfUser = localStorage.getItem('phoneofuser');
    if (phoneOfUser) {
      const userRef = database.ref('users/' + phoneOfUser);
      userRef.child('searchHistory').push({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        query: query
      }).then(() => {
        console.log('Search history recorded successfully');
      }).catch(error => {
        console.error('Error recording search history:', error);
      });
    } else {
      console.error('Phone number not found in local storage');
    }
  }








async function sendQuery() {
    const systemPromptInput = document.getElementById("systemPromptInput");
    const queryInput = document.getElementById("queryInput");
    const responseOutput = document.getElementById("responseOutput");
    const genresoutput = document.getElementById("genresresponseoutput");
    const ytIframe = document.getElementById("ytIframe");
    const systemPrompt = systemPromptInput.value;
    const query = queryInput.value;



    const searchvalue = queryInput.value.trim();
    if (searchvalue !== '') {
        recordSearchHistory(searchvalue);

    } else {
        console.error('Empty query');
    }




    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBBw872-_At2hShtPLSK6D8EptkBcHUCxI", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt,
                            },
                            {
                                text: query,
                            },
                        ],
                    },
                ],
            }),
        });

        const responseData = await response.json();

        const generatedText = responseData.candidates[0].content.parts[0].text;

        const formattedText = generatedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        responseOutput.innerHTML = formattedText;

        const response2 = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBBw872-_At2hShtPLSK6D8EptkBcHUCxI", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: "Based On the given prompt you want to find the best generes or theme of this text , be as accurate as possible and give only one word generes response " + formattedText, // Use the generated text as a new query
                            },
                        ],
                    },
                ],
            }),
        });

        const responseData2 = await response2.json();

        const generatedText2 = responseData2.candidates[0].content.parts[0].text;

        const formattedText2 = generatedText2.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        genresoutput.innerHTML = formattedText2;
        searchYouTube(formattedText2);

    } catch (error) {
        console.error(error);
        responseOutput.textContent = "Error: Could not communicate with : Hyper_X_Gemini Model.";
    }
}



function searchYouTube(genre) {
    const ytapikey = "AIzaSyBBZSWN5BPFDRq118ayZtoE7GgPWWtQj1U";
    const searchQuery = encodeURIComponent(genre) + "Instrumental Ambiance Music";
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${ytapikey}&part=snippet&type=video&q=${searchQuery}`;

    fetch(youtubeUrl)
        .then(response => response.json())
        .then(data => {
            ytIframe.src = `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
        })
        .catch(error => {
            console.error('Error fetching YouTube data:', error);
        });
}
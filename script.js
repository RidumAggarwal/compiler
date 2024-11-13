const compile = document.getElementById('compile-button');
const output = document.getElementById('output-section');
let intervalId = null; // Declare intervalId here
let codeId;
compile.addEventListener('click', function() {
  output.innerHTML = 'Compiling...';
  const code = document.getElementById('code-section').value;
  const langId = document.getElementById('language').value;

  if (!code) {
    output.innerHTML = 'Please enter some code.';
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://course.codequotient.com/api/executeCode', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({ code: code, langId: langId }));
    console.log(xhr.readyState);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        if (response.error) {
          output.innerHTML = `Error: ${response.error}`;
        } else {
           codeId = response.codeId;

          

          intervalId = setInterval(() => {
            const resultXhr = new XMLHttpRequest();
            resultXhr.open('GET', `https://course.codequotient.com/api/codeResult/${response.codeId}`, true);
            resultXhr.setRequestHeader('Content-Type', 'application/json');
            resultXhr.send();

            resultXhr.onerror = () => {
              console.error('Error fetching code result:', resultXhr.statusText);
              output.innerHTML = 'Error fetching code result. Please try again.';
            };

            resultXhr.onload = () => {
              console.log(resultXhr.status);
              if (resultXhr.status === 200) {
                const result = JSON.parse(resultXhr.responseText);
                if (result.data) {
                  clearInterval(intervalId);
                  intervalId = null; // Reset intervalId
                  const data = JSON.parse(result.data);
                  if (data.error) {
                    output.innerHTML = `Error: ${data.error}`;
                  } 
                  else {
                    output.innerHTML = `${data.output}`;
                  }
                }
              } 
              else {
                console.error('Error fetching code result:', resultXhr.statusText);
                output.innerHTML = 'Error fetching code result. Please try again.';
              }
              
            };
          }, 2000);
        }
      } else {
        output.innerHTML = 'Failed to compile code. Please try again.';
      }
    }
  };
});
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://de.hideproxy.me/go.php?u=qqu0qcPhQpLjdNCSBo%2BzWv%2BvVAlAj3Si1Hk3w67Rz7wWlzoXzldu%2FghBCwQrPrQhJA%3D%3D&b=5&f=norefer', true);
xhr.onload = function(e) {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      var sites = JSON.parse(xhr.responseText);

      for (var i = 0; i < sites.length; i++) {
        if (window.location.href.includes(sites[i].domainName)) {
          var titles = document.getElementsByTagName('h1');
          titles[0].innerText = titles[0].innerText + ' (★★★★★)';
        }
      }
    }
  }
};
xhr.onerror = function(e) {};
xhr.send(null);

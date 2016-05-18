var map;
var locations = {};
var search = "";

var getLocations = function() {
  $("#results ul").empty();
  search = $("#search-input").val();
  $.getJSON("http://nominatim.openstreetmap.org/search?format=json&limit=5&q=" + search, function (data) {
    data.forEach(function(location){
      $("#results ul").append("<li id=" + location.osm_id + ">" + location.display_name + "</li>");
      locations[location.osm_id] = location;
    });
    $("#results ul li").click(centerFocus);
    $("#close").click(removeLocations);
  });
}

var removeLocations = function(){
  $("#results ul").text("");
  locations = {};
  search = "";
}

var centerFocus = function(event) {
  var location = locations[event.target.id];

  map.panTo({lat: location.lat, lon: location.lon});
  L.marker([location.lat, location.lon]).addTo(map)
    .bindPopup(location.display_name)
    .openPopup();
  getPhotos()
}

var getPhotos = function() {
  var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
  var tag = $("#search").val();
  $.getJSON( flickrAPI, {
    tags: tag,
    tagmode: "any",
    format: "json"
  })
    .done(function (data, textStatus, jqXHR) {
      $('#photos').text("");
      var photos = data.items;
      for (var i = 0; i < photos.length; i++) {
        var div = document.createElement("div");
        div.className = "photo";
        div.innerHTML = photos[i].description;
        $('#photos').append(div);
      }
    })
    .fail(function (data, textStatus, jqXHR) {
      $('#photos').text("Couldn't load doc");
    });
}

$(document).ready(function(){
  map = L.map("map").setView([40.45, -3.69], 11);
  L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
  }).addTo(map);

  $("#search").on("keypress", function (event) {
    if (event.which === 13) {
      getLocations();
    }
  });
});

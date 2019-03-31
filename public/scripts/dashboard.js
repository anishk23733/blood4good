var db = firebase.firestore();
document.getElementById("map").style.display = "none";

// let modifiedName = getUserName()
// 	.toLowerCase()
// 	.replace(" ", "_");

setTimeout(() => {
	let modifiedName = getUserName()
		.toLowerCase()
		.replace(" ", "_");
	document.getElementById("username").innerHTML = getUserName();
	console.log(modifiedName);
}, 1000);

document.getElementById("submit-button").addEventListener("click", event => {
	event.preventDefault();

	let modifiedName = getUserName()
		.toLowerCase()
		.replace(" ", "_");

	let address = document.getElementById("address").value;
	let phone = document.getElementById("phone").value;
	let bloodType = document.getElementById("blood-type").value;

	let completed = true;
	console.log(address);
	console.log(phone);
	console.log(bloodType);
	var usersRef = db.collection("users");

	usersRef.doc(modifiedName).set({
		name: getUserName(),
		address: address,
		phone: phone,
		bloodType: bloodType,
		completed: true
	});

	document.querySelector(".main-box").innerHTML = "";

	db.collection("users")
		.get()
		.then(function(querySnapshot) {
			let listOfAddresses = [];
			let listOfPhones = [];
			querySnapshot.forEach(function(doc) {
				// doc.data() is never undefined for query doc snapshots
				console.log(doc.id, " => ", doc.data());
				let mainBox = document.querySelector(".users-box");
				if (doc.data().bloodType == bloodType) {
					mainBox.insertAdjacentHTML(
						"afterbegin",
						`
				<a href="" class="userCard" id="${modifiedName}">
					<span>${doc.data().name}, </span>
					<span>${doc.data().bloodType}, </span>
					<span>${doc.data().phone}</span>
				</a>
				`
					);
					listOfAddresses.push(doc.data().address);
					listOfPhones.push(doc.data().phone);
				}
			});
			let geocodedAddress = {};
			listOfAddresses.forEach(e => {
				axios
					.get(
						`https://api.mapbox.com/geocoding/v5/mapbox.places/${e}.json?access_token=pk.eyJ1IjoicGthbWFuYm9pbmEiLCJhIjoiY2p0dzJxMXp1MjQxcTRkbzQwbzY1bnRyYyJ9.8l0DE7lZjw8REmf5rFmKdw`
					)
					.then(data => {
						geocodedAddress[e] = [
							data.data.features[0].center,
							e,
							listOfPhones[listOfAddresses.indexOf(e)]
						];
						console.log(geocodedAddress[e]);
					})
					.then(() => {
						// console.log(geocodedAddress);
						document.getElementById("map").style.display = "block";
						mapboxgl.accessToken =
							"pk.eyJ1IjoicGthbWFuYm9pbmEiLCJhIjoiY2p0dzJxMXp1MjQxcTRkbzQwbzY1bnRyYyJ9.8l0DE7lZjw8REmf5rFmKdw";
						var map = new mapboxgl.Map({
							container: "map",
							style: "mapbox://styles/mapbox/streets-v11",
							center:
								geocodedAddress[
									Object.keys(geocodedAddress)[0]
								][0],
							zoom: 10
						});

						let featuresObject = [];
						for (key in geocodedAddress) {
							featuresObject.push({
								type: "Feature",
								geometry: {
									type: "Point",
									coordinates: geocodedAddress[key][0]
								},
								properties: {
									title: geocodedAddress[key][2],
									description: geocodedAddress[key][1]
								}
							});
						}
						console.log("All the coordinates:" + featuresObject);
						var geojson = {
							type: "FeatureCollection",
							features: featuresObject
						};

						geojson.features.forEach(function(marker) {
							// create a HTML element for each feature
							var el = document.createElement("div");
							el.className = "marker";

							// make a marker for each feature and add to the map
							new mapboxgl.Marker(el)
								.setLngLat(marker.geometry.coordinates)
								.setPopup(
									new mapboxgl.Popup({ offset: 25 }) // add popups
										.setHTML(
											"<h3>" +
												marker.properties.title +
												"</h3><p>" +
												marker.properties.description +
												"</p>"
										)
								)
								.addTo(map);
						});
					});
			});
			// geocodedAddress.forEach(e => {
			// 	var marker = {pin-s}-{#ffff}({lon},{lat});

			// });
		});
});

function signIn() {
	// Sign in Firebase using popup auth and Google as the identity provider.
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider);
}

// Signs-out of Friendly Chat.
function signOut() {
	// Sign out of Firebase.
	firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
	// Listen to auth state changes.
	firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns the signed-in user's profile Pic URL.
function getProfilePicUrl() {
	return (
		firebase.auth().currentUser.photoURL ||
		"/images/profile_placeholder.png"
	);
}

// Returns the signed-in user's display name.
function getUserName() {
	return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
	return !!firebase.auth().currentUser;
}
function authStateObserver(user) {
	if (user) {
		console.log("signed in!");
		if (
			window.location.href == "../login.html" ||
			window.location.href == "../index.html"
		) {
			window.location.href = "../dashboard.html";
		}
	} else {
		console.log("signed out!");
		window.location.href = "../login.html";
	}
}

initFirebaseAuth();

// Remove the warning about timstamps change.
var firestore = firebase.firestore();
var settings = { timestampsInSnapshots: true };
firestore.settings(settings);

document.getElementById("sign-out").addEventListener("click", event => {
	event.preventDefault();
	signOut();
});

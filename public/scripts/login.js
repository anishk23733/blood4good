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
		window.location.href = "../dashboard.html";
	} else {
		console.log("signed out!");
	}
}

initFirebaseAuth();

// Remove the warning about timstamps change.
var firestore = firebase.firestore();
var settings = { timestampsInSnapshots: true };
firestore.settings(settings);

document.getElementById("google-sign-in").addEventListener("click", () => {
	event.preventDefault();
	signIn();
	// window.location.href = "../dashboard.html";
});

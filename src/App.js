import "./App.css";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  FacebookAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import { useState } from "react";

const app = initializeApp(firebaseConfig);

function App() {
  const gProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const ghProvider = new GithubAuthProvider();

  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    img: "",
  });
  const [newUser, setNewUser] = useState(false);
  // Google authentication
  const handleGoogleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, gProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          img: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
      });
  };

  const handleGoogleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          img: "",
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Facebook authentication
  const handleFacebookSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  // Github authentication
  const handleGithubSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, ghProvider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          img: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };
  const handleGithubSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: "",
          email: "",
          img: "",
        };
        setUser(signedOutUser);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // Password authentication
  const handleFieldBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const isPassValid = e.target.value.length > 6;
      const isPassHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPassValid && isPassHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
    console.log(user);
  };
  const handleSubmitForm = (e) => {
    if (newUser && user.email && user.password) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          updateUserName(user.name);
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }
    if (user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const user = userCredential.user;
          
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    }
    e.preventDefault();
  };
  const updateUserName = (name) => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="App">
      {/* Google authentication */}
      <div>
        <h2>Authentication With Google</h2>
        {user.isSignedIn ? (
          <button onClick={handleGoogleSignOut}>Google Sign out</button>
        ) : (
          <button onClick={handleGoogleSignIn}>Google Sign in</button>
        )}
        <h3>Name: {user.name}</h3>
        <h4>Email: {user.email}</h4>
        <img src={user.img} alt="" />
      </div>
      {/* Facebook authentication */}
      <div>
        <h2>Authentication With Facebook</h2>
        <button onClick={handleFacebookSignIn}>Facebook Login</button>
      </div>
      {/* Github authentication*/}
      <div>
        <h2>Authentication With Github</h2>
        {user.isSignedIn ? (
          <button onClick={handleGithubSignOut}>Github Sign out</button>
        ) : (
          <button onClick={handleGithubSignIn}>Github Sign in</button>
        )}
      </div>
      {/* Gmail, password authentication */}
      <div>
        <h2>Authentication With Password</h2>
        <input
          onClick={() => {
            setNewUser(!newUser);
          }}
          type="checkbox"
          id="newUser"
        />
        <label htmlFor="newUser">New User</label>
        <form>
          {newUser && (
            <input
              onBlur={handleFieldBlur}
              type="text"
              name="name"
              placeholder="Enter Your Name"
              required
            />
          )}
          <br />
          <input
            onBlur={handleFieldBlur}
            type="text"
            name="email"
            placeholder="Enter Your Email"
            required
          />
          <br />
          <input
            onBlur={handleFieldBlur}
            type="password"
            name="password"
            placeholder="Enter Your Password"
            required
          />
          <br />
          {newUser ? (
            <input onClick={handleSubmitForm} type="submit" value="Sign up" />
          ) : (
            <input onClick={handleSubmitForm} type="submit" value="Sign in" />
          )}
        </form>
      </div>
    </div>
  );
}

export default App;

/* <div className="App">
      {user.isSignedIn ? (
        <button onClick={handleSignOut}>Sign out</button>
      ) : (
        <button onClick={handleSignIn}>Sign in</button>
      )}
      {user.isSignedIn && (
        <div>
          <h3>{user.name}</h3>
          <h4>{user.email}</h4>
          <img src={user.img} alt="" />
        </div>
      )}
      <h2>Form Authentication</h2>
      <input
        onChange={() => {
          setNewUser(!newUser);
        }}
        type="checkbox"
        name="newUser"
        id=""
      />
      <label htmlFor="newUser">New User Sign Up</label>
      <form onClick={handleSubmit}>
        {newUser && (
          <input
            onBlur={handleBlur}
            type="text"
            name="name"
            placeholder="Your name"
            required
          />
        )}
        <br />
        <input
          onBlur={handleBlur}
          type="text"
          name="email"
          placeholder="Your email address"
          required
        />
        <br />
        <input
          onBlur={handleBlur}
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <br />
        <input type="submit" value={newUser ? "Sign up" : "Sign in"} />
      </form>
      {user.success ? (
        <p style={{ color: "green" }}>
          User was successfully {newUser ? "created" : "logged in"}
        </p>
      ) : (
        <p style={{ color: "red" }}>{user.error}</p>
      )}
    </div> */

// const [newUser, setNewUser] = useState(false);
// const [user, setUser] = useState({
//   isSignedIn: false,
//   name: "",
//   email: "",
//   img: "",
// });
// const handleSignIn = () => {
//   const provider = new GoogleAuthProvider();
//   const auth = getAuth();
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       const { displayName, email, photoURL } = result.user;
//       const signedInUser = {
//         isSignedIn: true,
//         name: displayName,
//         email: email,
//         img: photoURL,
//       };
//       setUser(signedInUser);
//     })
//     .catch((error) => {
//       const errorMessage = error.message;
//       console.log(errorMessage);
//     });
// };
// const handleSignOut = () => {
//   const auth = getAuth();
//   signOut(auth)
//     .then(() => {
//       const signedOut = {
//         isSignedIn: false,
//         name: "",
//         email: "",
//         img: "",
//         error: "",
//         success: true,
//       };
//       setUser(signedOut);
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// };

// // form authentication
// const handleBlur = (e) => {
//   let isFieldValid = true;
//   if (e.target.name === "email") {
//     isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
//   }
//   if (e.target.name === "password") {
//     const isPasswordValid = e.target.value.length > 6;
//     const isPasswordHasNumber = /\d{1}/.test(e.target.value);
//     isFieldValid = isPasswordValid && isPasswordHasNumber;
//   }
//   if (isFieldValid) {
//     const newUserInfo = { ...user };
//     newUserInfo[e.target.name] = e.target.value;
//     setUser(newUserInfo);
//   }
// };
// const handleSubmit = (e) => {
//   if (newUser && user.email && user.password) {
//     const auth = getAuth();
//     createUserWithEmailAndPassword(auth, user.email, user.password)
//       .then((result) => {
//         const newUserInfo = { ...user };
//         newUserInfo.error = "";
//         newUserInfo.success = true;
//         setUser(newUserInfo);
//         updateUserName(user.name);
//       })
//       .catch((error) => {
//         const errorMessage = error.message;
//         const newUserInfo = { ...user };
//         newUserInfo.error = errorMessage;
//         newUserInfo.success = false;
//         setUser(newUserInfo);
//       });
//   }
//   if (user.email && user.password) {
//     const auth = getAuth();
//     signInWithEmailAndPassword(auth, user.email, user.password)
//       .then((result) => {
//         const newUserInfo = { ...user };
//         newUserInfo.error = "";
//         newUserInfo.success = true;
//         setUser(newUserInfo);
//         console.log(result);
//       })
//       .catch((error) => {
//         const errorMessage = error.message;
//         const newUserInfo = { ...user };
//         newUserInfo.error = errorMessage;
//         newUserInfo.success = false;
//         setUser(newUserInfo);
//       });
//   }
//   e.preventDefault();
// };
// const updateUserName = (name) => {
//   const auth = getAuth();
//   updateProfile(auth.currentUser, {
//     displayName: name,
//   })
//     .then((res) => {})
//     .catch((error) => {
//       console.log(error);
//     });
// };

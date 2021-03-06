"use strict";

import React from "react";
import T from "prop-types";
import createClass from "create-react-class";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Dimensions
} from "react-native";
import { styles, Text } from "./styles";
import { KeyboardAwareView } from "react-native-keyboard-aware-view";

export var NativeLogin = createClass({
  displayName: "NativeLogin",
  getDefaultProps: function() {
    return {
      onLogin: function() {},
      onRegister: function() {}
    };
  },
  getInitialState: function() {
    return {
      page: "sign-in",
      keyboard: false,
      username: "",
      password: "",
      password2: "",
      email: ""
    };
  },
  doLogin: function() {
    this.props.onLogin(this.state.username, this.state.password);
  },
  doRegister: function() {
    if (this.state.password === "") {
      Alert.alert("You must enter a password.");
    } else if (this.state.password !== this.state.password2) {
      Alert.alert("Passwords don't match.");
    } else {
      this.props.onRegister(
        this.state.username,
        this.state.password,
        this.state.email
      );
    }
  },
  componentWillMount: function() {
    var verb;
    this.onKeyboardShow = () => {
      this.setState({
        keyboard: true
      });
    };
    this.onKeyboardHide = () => {
      this.setState({
        keyboard: false
      });
    };
    verb = Platform.OS === "ios" ? "Will" : "Did";
    Keyboard.addListener(`keyboard${verb}Show`, this.onKeyboardShow);
    Keyboard.addListener(`keyboard${verb}Hide`, this.onKeyboardHide);
  },
  componentWillUnmount: function() {
    var verb;
    verb = Platform.OS === "ios" ? "Will" : "Did";
    Keyboard.removeListener(`keyboard${verb}Show`, this.onKeyboardShow);
    Keyboard.removeListener(`keyboard${verb}Hide`, this.onKeyboardHide);
  },
  render: function() {
    var height, tablet;
    ({ height } = Dimensions.get("window"));
    tablet = height > 900;
    return (
      <KeyboardAwareView
        animated={true}
        style={{
          flex: 1,
          flexDirection: "column"
        }}
      >
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={
            this.state.page === "sign-in"
              ? require("../web/assets/img/bg1.jpg")
              : require("../web/assets/img/bg2.jpg")
          }
          style={{
            flex: this.state.keyboard && !tablet ? 0 : 1,
            flexDirection: "column",
            backgroundColor: "rgba(0,0,0,0)",
            alignItems: "center",
            justifyContent: "space-between",
            width: null,
            height: null
          }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                height: 40
              }}
            />
          </TouchableWithoutFeedback>
          {!(this.state.keyboard && !tablet) ? (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Image
                  source={require("../web/assets/img/siftr-logo.png")}
                  style={{
                    width: 190 * 0.5,
                    height: 196 * 0.5,
                    marginBottom: 20
                  }}
                />
                <Text
                  style={{
                    color: "white"
                  }}
                >
                  Exploring our world together
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            void 0
          )}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-around",
                alignSelf: "stretch"
              }}
            >
              {this.props.viola ? (
                <TouchableOpacity
                  style={{
                    padding: 16,
                    borderBottomWidth: 7,
                    borderBottomColor: "rgba(0,0,0,0)"
                  }}
                  onPress={this.props.backToViola}
                >
                  <Text
                    style={{
                      color: "white"
                    }}
                  >
                    Back
                  </Text>
                </TouchableOpacity>
              ) : (
                void 0
              )}
              <TouchableOpacity
                style={{
                  padding: 16,
                  borderBottomWidth: 7,
                  borderBottomColor:
                    this.state.page === "sign-in" ? "white" : "rgba(0,0,0,0)"
                }}
                onPress={() => {
                  this.setState({
                    page: "sign-in",
                    password: "",
                    password2: "",
                    email: ""
                  });
                }}
              >
                <Text
                  style={{
                    color: "white"
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 16,
                  borderBottomWidth: 7,
                  borderBottomColor:
                    this.state.page === "sign-up" ? "white" : "rgba(0,0,0,0)"
                }}
                onPress={() => {
                  this.setState({
                    page: "sign-up",
                    password: "",
                    password2: "",
                    email: ""
                  });
                }}
              >
                <Text
                  style={{
                    color: "white"
                  }}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </ImageBackground>
        {function() {
          switch (this.state.page) {
            case "sign-in":
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column"
                  }}
                >
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "stretch"
                      }}
                    >
                      <TextInput
                        placeholder="Username"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus={true}
                        onChangeText={username => {
                          this.setState({ username });
                        }}
                        value={this.state.username}
                        onSubmitEditing={() => {
                          this.passwordBox.focus();
                        }}
                        returnKeyType="next"
                      />
                      <TextInput
                        ref={box => {
                          this.passwordBox = box;
                        }}
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={password => {
                          this.setState({ password });
                        }}
                        value={this.state.password}
                        onSubmitEditing={this.doLogin}
                        returnKeyType="go"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableOpacity
                    onPress={this.doLogin}
                    style={{
                      backgroundColor: "rgb(255,124,107)",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 20,
                      paddingBottom: 20
                    }}
                  >
                    <Text
                      style={{
                        color: "white"
                      }}
                    >
                      Log in
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            case "sign-up":
              return (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column"
                  }}
                >
                  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "stretch"
                      }}
                    >
                      <TextInput
                        placeholder="Username"
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoFocus={true}
                        onChangeText={username => {
                          this.setState({ username });
                        }}
                        value={this.state.username}
                        onSubmitEditing={() => {
                          this.passwordBox.focus();
                        }}
                        returnKeyType="next"
                      />
                      <TextInput
                        ref={box => {
                          this.passwordBox = box;
                        }}
                        placeholder="Password"
                        secureTextEntry={true}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={password => {
                          this.setState({ password });
                        }}
                        value={this.state.password}
                        onSubmitEditing={() => {
                          this.password2Box.focus();
                        }}
                        returnKeyType="next"
                      />
                      <TextInput
                        ref={box => {
                          this.password2Box = box;
                        }}
                        placeholder="Password (confirm)"
                        secureTextEntry={true}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={password2 => {
                          this.setState({ password2 });
                        }}
                        value={this.state.password2}
                        onSubmitEditing={() => {
                          this.emailBox.focus();
                        }}
                        returnKeyType="next"
                      />
                      <TextInput
                        ref={box => {
                          this.emailBox = box;
                        }}
                        placeholder="Email (optional)"
                        secureTextEntry={true}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        onChangeText={email => {
                          this.setState({ email });
                        }}
                        value={this.state.email}
                        onSubmitEditing={this.doRegister}
                        returnKeyType="go"
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableOpacity
                    onPress={this.doRegister}
                    style={{
                      backgroundColor: "rgb(255,124,107)",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 20,
                      paddingBottom: 20
                    }}
                  >
                    <Text
                      style={{
                        color: "white"
                      }}
                    >
                      Create account
                    </Text>
                  </TouchableOpacity>
                </View>
              );
          }
        }.call(this)}
      </KeyboardAwareView>
    );
  }
});

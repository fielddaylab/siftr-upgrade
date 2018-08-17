"use strict";

var OptionsModal;

import React from "react";
import T from "prop-types";

import { Note, Auth, Comment, Field } from "./aris";

import {
  Alert,
  View,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  BackHandler,
  Modal,
  TouchableWithoutFeedback,
  Platform
} from "react-native";
import FitImage from "react-native-fit-image";
import Hyperlink from "react-native-hyperlink";
import Gallery from "react-native-image-gallery";
import { styles, Text } from "./styles";
import { Media, CacheMedia } from "./media";
import firebase from "react-native-firebase";

import { clicker, withSuccess } from "./utils";


function writeParagraphs(text) {
  var i, j, len, para, paras, results;
  paras = (function() {
    var j, len, ref, results;
    ref = text.split("\n");
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      para = ref[j];
      if (para.match(/\S/)) {
        results.push(para);
      }
    }
    return results;
  })();
  results = [];
  for (i = j = 0, len = paras.length; j < len; i = ++j) {
    para = paras[i];
    results.push(
      <Hyperlink
        key={i}
        onPress={url => {
          return Linking.openURL(url);
        }}
        linkStyle={{
          color: "#176fb7"
        }}
      >
        <Text
          style={{
            margin: 10
          }}
        >
          {para}
        </Text>
      </Hyperlink>
    );
  }
  return results;
}


const SquareImage = class SquareImage extends React.Component {
  // image box that sets the height equal to the width
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var ref;
    return (
      <View
        style={{
          alignSelf: "stretch",
          flexDirection: "row",
          height: (ref = this.state.width) != null ? ref : void 0,
          alignItems: "stretch"
        }}
        onLayout={this.resize.bind(this)}
      >
        {this.props.sources.map((source, i) => {
          var ref1;
          if ((ref1 = source.uri) === null || ref1 === "") {
            source = null;
          }
          return (
            <TouchableOpacity
              key={i}
              onPress={() => {
                this.props.onGallery(source);
              }}
              style={{
                flex: 1,
                alignItems: "stretch"
              }}
            >
              <Image
                source={source}
                style={{
                  resizeMode: "cover",
                  flex: 1
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  resize(evt) {
    var dims;
    dims = evt.nativeEvent.layout;
    this.setState({
      width: dims.width
    });
  }
};

const SiftrCommentInput = function() {
  class SiftrCommentInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        text: this.props.defaultText
      };
    }

    doSave() {
      this.props.onSave(this.state.text);
      setTimeout(() => {
        this.setState({
          text: ""
        });
      }, 100);
    }

    render() {
      return (
        <View
          style={{
            flexDirection: "row",
            alignItems: "stretch",
            marginTop: 5,
            marginBottom: 5
          }}
        >
          <TextInput
            placeholder={
              this.props.canCancel ? "Save comment..." : "Add comment..."
            }
            value={this.state.text}
            onChangeText={text => {
              this.setState({ text });
            }}
            style={{
              backgroundColor: "white",
              padding: 5,
              fontSize: 15,
              flex: 1
            }}
          />
          <TouchableOpacity onPress={this.doSave.bind(this)}>
            <Text style={styles.blueButton}>Save</Text>
          </TouchableOpacity>
          {this.props.canCancel ? (
            <TouchableOpacity onPress={this.props.onCancel}>
              <Text
                style={[
                  styles.grayButton,
                  {
                    marginLeft: 5
                  }
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          ) : (
            void 0
          )}
        </View>
      );
    }


  }

  SiftrCommentInput.propTypes = {
    defaultText: T.string,
    canCancel: T.bool,
    onSave: T.func,
    onCancel: T.func
  };

  SiftrCommentInput.defaultProps = {
    defaultText: "",
    canCancel: false,
    onSave: function() {},
    onCancel: function() {}
  };

  return SiftrCommentInput;
}.call(this);

OptionsModal = function() {
  class OptionsModal extends React.Component {
    render() {
      return (
        <Modal transparent={true} onRequestClose={this.props.onClose}>
          <TouchableWithoutFeedback onPress={this.props.onClose}>
            <View
              style={{
                height: 150,
                backgroundColor: "rgba(0,0,0,0.5)"
              }}
            />
          </TouchableWithoutFeedback>
          <View
            style={{
              backgroundColor: "white",
              flex: 1,
              padding: 10,
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start"
            }}
          >
            <TouchableOpacity onPress={this.props.onClose}>
              <Image
                style={{
                  margin: 10
                }}
                source={require("../web/assets/img/x-blue.png")}
              />
            </TouchableOpacity>
            {this.props.options.map(({ text, onPress }) => {
              return (
                <TouchableOpacity key={text} onPress={onPress}>
                  <Text
                    style={{
                      margin: 10
                    }}
                  >
                    {text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Modal>
      );
    }
  }

  OptionsModal.defaultProps = {
    onClose: function() {},
    options: []
  };

  return OptionsModal;
}.call(this);

const GalleryModal = class GalleryModal extends React.Component {
  render() {
    return (
      <Modal onRequestClose={this.props.onClose}>
        <Gallery
          style={{
            flex: 1,
            backgroundColor: "black"
          }}
          images={this.props.images}
          initialPage={this.props.initialPage}
        />
        <TouchableOpacity
          onPress={this.props.onClose}
          style={{
            position: "absolute",
            top: 25,
            left: 15,
            backgroundColor: "rgba(255,255,255,0.2)",
            padding: 2
          }}
        >
          <Image
            source={require("../web/assets/img/icon-back.png")}
            style={{
              width: 36 * 0.75,
              height: 28 * 0.75
            }}
          />
        </TouchableOpacity>
      </Modal>
    );
  }
};

const SiftrComment = function() {
  class SiftrComment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        editing: false,
        commentModal: false,
        userPicture: null
      };
    }

    getUserMedia() {
      this.props.auth.call(
        "media.getMedia",
        {
          media_id: this.props.comment.user.media_id
        },
        withSuccess(userPicture => {
          this.setState({ userPicture });
        })
      );
    }

    componentWillMount() {
      this.getUserMedia();
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.comment.user.user_id !== this.props.comment.user.user_id) {
        this.getUserMedia();
      }
    }

    confirmDelete() {
      var cancel, msg, ok;
      msg = "Are you sure you want to delete this comment?";
      cancel = {
        text: "Cancel",
        style: "cancel",
        onPress: function() {}
      };
      ok = {
        text: "OK",
        onPress: () => {
          this.props.onDelete(this.props.comment);
        }
      };
      Alert.alert("Confirm Delete", msg, [cancel, ok]);
    }


    render() {
      var ref, ref1, ref2, ref3;
      if (this.state.editing) {
        return (
          <SiftrCommentInput
            defaultText={this.props.comment.description}
            canCancel={true}
            onCancel={() => {
              this.setState({
                editing: false
              });
            }}
            onSave={text => {
              this.setState({
                editing: false
              });
              this.props.onEdit(text);
            }}
          />
        );
      } else {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start"
            }}
          >
            {this.state.userPicture != null ? (
              <CacheMedia
                url={this.state.userPicture.thumb_url}
                withURL={url => {
                  return (
                    <Image
                      source={
                        url != null
                          ? {
                              uri: url
                            }
                          : void 0
                      }
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 13,
                        margin: 10,
                        marginRight: 0,
                        resizeMode: "cover"
                      }}
                    />
                  );
                }}
              />
            ) : (
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#888888",
                  margin: 10,
                  marginRight: 0
                }}
              />
            )}
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignItems: "stretch"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  margin: 10
                }}
              >
                <Text
                  style={{
                    fontSize: 13
                  }}
                >
                  {this.props.comment.user.display_name} at{" "}
                  {this.props.comment.created.toLocaleString()}
                </Text>
                {((ref = this.props.auth.authToken) != null
                  ? ref.user_id
                  : void 0) === this.props.comment.user.user_id ||
                (((ref1 = this.props.auth.authToken) != null
                  ? ref1.user_id
                  : void 0) === this.props.comment.user.user_id ||
                  this.props.isAdmin) ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({
                        commentModal: true
                      });
                    }}
                  >
                    <Image
                      style={{
                        marginLeft: 10,
                        width: 17,
                        height: 17
                      }}
                      source={require("../web/assets/img/icon-edit-pencil.png")}
                    />
                  </TouchableOpacity>
                ) : (
                  void 0
                )}
                {this.state.commentModal ? (
                  <OptionsModal
                    onClose={() => {
                      this.setState({
                        commentModal: false
                      });
                    }}
                    options={[
                      ((ref2 = this.props.auth.authToken) != null
                        ? ref2.user_id
                        : void 0) === this.props.comment.user.user_id
                        ? {
                            text: "Edit comment",
                            onPress: () => {
                              this.setState({
                                editing: true,
                                commentModal: false
                              });
                            }
                          }
                        : void 0,
                      ((ref3 = this.props.auth.authToken) != null
                        ? ref3.user_id
                        : void 0) === this.props.comment.user.user_id ||
                      this.props.isAdmin
                        ? {
                            text: "Delete comment",
                            onPress: this.confirmDelete.bind(this)
                          }
                        : void 0
                    ].filter(x => {
                      return x != null;
                    })}
                  />
                ) : (
                  void 0
                )}
              </View>
              <View>{writeParagraphs(this.props.comment.description)}</View>
            </View>
          </View>
        );
      }
    }

  }

  SiftrComment.propTypes = {
    note: T.instanceOf(Note).isRequired,
    comment: T.instanceOf(Comment).isRequired,
    auth: T.instanceOf(Auth).isRequired,
    onEdit: T.func,
    onDelete: T.func,
    isAdmin: T.bool
  };

  SiftrComment.defaultProps = {
    onEdit: function() {},
    onDelete: function() {},
    isAdmin: false
  };

  return SiftrComment;
}.call(this);

const SiftrComments = function() {
  class SiftrComments extends React.Component {
    render() {
      return (
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: "#F1F5F4"
          }}
        >
          {this.props.comments.length === 0 ? (
            <View
              style={{
                flexDirection: "column",
                alignItems: "flex-start",
                margin: 10
              }}
            >
              <Text
                style={{
                  fontSize: 13
                }}
              >
                No comments.
              </Text>
            </View>
          ) : (
            this.props.comments.map(comment => {
              return (
                <SiftrComment
                  key={comment.comment_id}
                  comment={comment}
                  note={this.props.note}
                  auth={this.props.auth}
                  onEdit={text => {
                    this.props.onEditComment(comment, text);
                  }}
                  onDelete={this.props.onDeleteComment}
                  isAdmin={this.props.isAdmin}
                />
              );
            })
          )}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F1F5F4"
            }}
          >
            {this.props.auth.authToken != null ? (
              <SiftrCommentInput
                canCancel={false}
                onSave={this.props.onNewComment}
              />
            ) : (
              <Text
                style={{
                  margin: 10
                }}
              >
                Log in to write a comment.
              </Text>
            )}
          </View>
        </View>
      );
    }


  }

  SiftrComments.propTypes = {
    note: T.instanceOf(Note).isRequired,
    comments: T.arrayOf(T.instanceOf(Comment)).isRequired,
    auth: T.instanceOf(Auth).isRequired,
    onEditComment: T.func,
    onNewComment: T.func,
    onDeleteComment: T.func,
    isAdmin: T.bool
  };

  SiftrComments.defaultProps = {
    onEditComment: function() {},
    onNewComment: function() {},
    onDeleteComment: function() {},
    isAdmin: false
  };

  return SiftrComments;
}.call(this);

export const SiftrNoteView = function() {
  class SiftrNoteView extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        comments: null,
        noteModal: false,
        gallery: null
      };
    }

    openNoteOptions() {
      this.setState({
        noteModal: true
      });
    }

    componentWillMount() {
      this.loadExtra();
      firebase.analytics().logEvent("view_note", {
        note_id: this.props.note.note_id,
        game_id: this.props.note.game_id
      });
      this.hardwareBack = () => {
        this.props.onClose();
        return true;
      };
      BackHandler.addEventListener("hardwareBackPress", this.hardwareBack);
    }

    componentWillUnmount() {
      BackHandler.removeEventListener("hardwareBackPress", this.hardwareBack);
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.note.note_id !== nextProps.note.note_id) {
        this.setState({
          comments: null
        });
        this.loadExtra(nextProps.note);
      }
    }

    loadExtra(note = this.props.note) {
      if (note.pending) {
        return;
      }
      // load comments
      this.props.auth.getNoteCommentsForNote(
        {
          note_id: note.note_id,
          game_id: note.game_id
        },
        withSuccess(comments => {
          var comment;
          if (this.props.note.note_id === note.note_id) {
            this.setState({
              comments: (function() {
                var j, len, results;
                results = [];
                for (j = 0, len = comments.length; j < len; j++) {
                  comment = comments[j];
                  if (comment.description.match(/\S/)) {
                    results.push(comment);
                  }
                }
                return results;
              })()
            });
          }
        })
      );
      // load field data
      this.props.auth.getFieldDataForNote(
        {
          note_id: note.note_id
        },
        withSuccess(data => {
          if (this.props.note.note_id === note.note_id) {
            this.setState({
              field_data: data
            });
          }
        })
      );
    }

    doNewComment(text) {
      this.props.auth.createNoteComment(
        {
          game_id: this.props.note.game_id,
          note_id: this.props.note.note_id,
          description: text
        },
        withSuccess(() => {
          this.loadExtra();
        })
      );
    }

    doEditComment(comment, text) {
      this.props.auth.updateNoteComment(
        {
          note_comment_id: comment.comment_id,
          description: text
        },
        withSuccess(() => {
          this.loadExtra();
        })
      );
    }

    doDeleteComment(comment) {
      this.props.auth.call(
        "note_comments.deleteNoteComment",
        {
          note_comment_id: comment.comment_id
        },
        withSuccess(() => {
          this.loadExtra();
        })
      );
    }

    likeNote() {
      if (this.props.auth.authToken == null) {
        this.props.onPromptLogin();
        return;
      }
      this.props.auth.call(
        "notes.likeNote",
        {
          game_id: this.props.note.game_id,
          note_id: this.props.note.note_id
        },
        withSuccess(() => {
          this.props.onReload(this.props.note);
        })
      );
    }

    unlikeNote() {
      if (this.props.auth.authToken == null) {
        this.props.onPromptLogin();
        return;
      }
      this.props.auth.call(
        "notes.unlikeNote",
        {
          game_id: this.props.note.game_id,
          note_id: this.props.note.note_id
        },
        withSuccess(() => {
          this.props.onReload(this.props.note);
        })
      );
    }

    approveNote() {
      if (this.props.auth.authToken == null) {
        this.props.onPromptLogin();
        return;
      }
      this.props.auth.call(
        "notes.approveNote",
        {
          note_id: this.props.note.note_id
        },
        withSuccess(() => {
          this.props.onReload(this.props.note);
        })
      );
    }

    saveCaption(text) {
      this.props.auth.call(
        "notes.updateNote",
        {
          note_id: this.props.note.note_id,
          game_id: this.props.note.game_id,
          description: text
        },
        withSuccess(() => {
          this.props.onReload(this.props.note);
        })
      );
    }

    confirmFlag() {
      var cancel, msg, ok;
      msg =
        "Are you sure you want to flag this note for inappropriate content?";
      cancel = {
        text: "Cancel",
        style: "cancel",
        onPress: function() {}
      };
      ok = {
        text: "OK",
        onPress: () => {
          this.props.onFlag(this.props.note);
        }
      };
      Alert.alert("Confirm Flag", msg, [cancel, ok]);
    }

    confirmDelete() {
      var cancel, msg, ok;
      msg = "Are you sure you want to delete this note?";
      cancel = {
        text: "Cancel",
        style: "cancel",
        onPress: function() {}
      };
      ok = {
        text: "OK",
        onPress: () => {
          this.props.onDelete(this.props.note);
        }
      };
      Alert.alert("Confirm Delete", msg, [cancel, ok]);
    }


    showFields() {
      var d,
        data,
        field,
        j,
        k,
        l,
        len,
        len1,
        len2,
        long,
        opt,
        opts,
        parts,
        ref,
        ref1,
        ref2,
        ref3,
        text;
      if (this.props.note.pending) {
        return null;
      } else if (
        !(this.state.field_data != null && this.props.fields != null)
      ) {
        return (
          <Text
            style={{
              margin: 10
            }}
          >
            Loading data...
          </Text>
        );
      } else {
        parts = [];
        if (this.props.tag != null) {
          parts.push(
            <View
              key={0}
              style={{
                borderTopWidth: 1,
                borderTopColor: "#F1F5F4",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              <Text
                style={{
                  margin: 10,
                  fontWeight: "bold"
                }}
              >
                Category
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    backgroundColor: this.props.getColor(this.props.tag),
                    width: 16,
                    height: 16,
                    borderRadius: 8
                  }}
                />
                <Text
                  style={{
                    margin: 10
                  }}
                >
                  {this.props.tag.tag}
                </Text>
              </View>
            </View>
          );
        }
        ref = this.props.fields;
        for (j = 0, len = ref.length; j < len; j++) {
          field = ref[j];
          data = function() {
            var k, len1, ref1, results;
            ref1 = this.state.field_data;
            results = [];
            for (k = 0, len1 = ref1.length; k < len1; k++) {
              d = ref1[k];
              if (d.field_id === field.field_id) {
                results.push(d);
              }
            }
            return results;
          }.call(this);
          long = false;
          switch (field.field_type) {
            case "TEXT":
            case "NOMEN":
              text = (ref1 = data[0]) != null ? ref1.field_data : void 0;
              break;
            case "TEXTAREA":
              text = (ref2 = data[0]) != null ? ref2.field_data : void 0;
              long = true;
              break;
            case "SINGLESELECT":
            case "MULTISELECT":
              opts = [];
              for (k = 0, len1 = data.length; k < len1; k++) {
                d = data[k];
                ref3 = field.options;
                for (l = 0, len2 = ref3.length; l < len2; l++) {
                  opt = ref3[l];
                  if (opt.field_option_id === d.field_option_id) {
                    opts.push(opt.option);
                  }
                }
              }
              text = opts.join(", ");
              break;
            default:
              continue;
          }
          if (!(text != null ? text.match(/\S/) : void 0)) {
            continue;
          }
          parts.push(
            <View
              key={field.field_id}
              style={{
                borderTopWidth: 1,
                borderTopColor: "#F1F5F4",
                flexDirection: long ? "column" : "row",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              <Text
                style={{
                  margin: 10,
                  fontWeight: "bold"
                }}
              >
                {field.label}
              </Text>
              <Text
                style={{
                  margin: 10
                }}
              >
                {text}
              </Text>
            </View>
          );
        }
        return parts;
      }
    }


    render() {
      var d,
        data,
        f,
        field,
        j,
        len,
        media_id,
        photoIDs,
        photoURLs,
        ref,
        ref1,
        ref2,
        ref3,
        ref4,
        uri;
      // TODO move to CacheMedia
      if (this.props.note.pending) {
        photoIDs = [];
        photoURLs = function() {
          var j, len, ref, results;
          ref = this.props.note.files;
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            f = ref[j];
            if (Platform.OS === "ios") {
              results.push(`${this.props.note.dir}/${f.filename}`);
            } else {
              results.push(`file://${this.props.note.dir}/${f.filename}`);
            }
          }
          return results;
        }.call(this);
      } else {
        photoIDs = [this.props.note.media_id];
        if (this.state.field_data != null && this.props.fields != null) {
          ref = this.props.fields;
          for (j = 0, len = ref.length; j < len; j++) {
            field = ref[j];
            if (field.field_type === "MEDIA") {
              data = function() {
                var k, len1, ref1, results;
                ref1 = this.state.field_data;
                results = [];
                for (k = 0, len1 = ref1.length; k < len1; k++) {
                  d = ref1[k];
                  if (d.field_id === field.field_id) {
                    results.push(d);
                  }
                }
                return results;
              }.call(this);
              if (data.length > 0) {
                photoIDs.push(data[0].media.media_id);
              }
            }
          }
        }
        photoURLs = function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = photoIDs.length; k < len1; k++) {
            media_id = photoIDs[k];
            results.push(this.state[`media${media_id}`] || "");
          }
          return results;
        }.call(this);
      }
      return (
        <ScrollView
          ref={sv => {
            this.scrollView = sv;
          }}
          style={{
            backgroundColor: "white",
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "column"
          }}
          keyboardShouldPersistTaps="handled"
        >
          {photoIDs.map(media_id => {
            return (
              <Media
                key={media_id}
                auth={this.props.auth}
                media_id={media_id}
                onLoad={url => {
                  this.setState({
                    [`media${media_id}`]: url
                  });
                }}
              />
            );
          })}
          {this.state.noteModal ? (
            <OptionsModal
              onClose={() => {
                this.setState({
                  noteModal: false
                });
              }}
              options={[
                this.props.note.user.user_id ===
                  ((ref1 = this.props.auth.authToken) != null
                    ? ref1.user_id
                    : void 0) && this.props.online
                  ? {
                      text: "Edit post",
                      onPress: () => {
                        this.props.onEdit(
                          this.props.note,
                          this.state.field_data
                        );
                      }
                    }
                  : void 0,
                this.props.note.published === "AUTO" &&
                ((ref2 = this.props.auth.authToken) != null
                  ? ref2.user_id
                  : void 0) !== this.props.note.user.user_id
                  ? {
                      text: "Flag for inappropriate content",
                      onPress: this.confirmFlag.bind(this)
                    }
                  : void 0,
                this.props.note.user.user_id ===
                  ((ref3 = this.props.auth.authToken) != null
                    ? ref3.user_id
                    : void 0) || this.props.isAdmin
                  ? {
                      text: "Delete post",
                      onPress: this.confirmDelete.bind(this)
                    }
                  : void 0
              ].filter(x => {
                return x != null;
              })}
            />
          ) : this.state.gallery != null ? (
            <GalleryModal
              onClose={() => {
                this.setState({
                  gallery: null
                });
              }}
              initialPage={photoURLs.indexOf(this.state.gallery)}
              images={(function() {
                var k, len1, results;
                results = [];
                for (k = 0, len1 = photoURLs.length; k < len1; k++) {
                  uri = photoURLs[k];
                  results.push({
                    source: { uri }
                  });
                }
                return results;
              })()}
            />
          ) : (
            void 0
          )}
          <SquareImage
            sources={(function() {
              var k, len1, results;
              results = [];
              for (k = 0, len1 = photoURLs.length; k < len1; k++) {
                uri = photoURLs[k];
                results.push({ uri });
              }
              return results;
            })()}
            onGallery={({ uri }) => {
              this.setState({
                gallery: uri
              });
            }}
          />
          <View
            style={{
              backgroundColor: "white",
              padding: 5,
              flexDirection: "row",
              justifyContent: "flex-start",
              borderBottomColor: "#F1F5F4",
              borderBottomWidth: 1,
              alignItems: "center"
            }}
          >
            {this.props.auth.authToken != null &&
            this.props.note.player_liked ? (
              <TouchableOpacity onPress={this.unlikeNote.bind(this)}>
                <Image
                  style={{
                    margin: 5,
                    width: 18,
                    height: 16
                  }}
                  source={require("../web/assets/img/icon-heart-full.png")}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={this.likeNote.bind(this)}>
                <Image
                  style={{
                    margin: 5,
                    width: 18,
                    height: 16
                  }}
                  source={require("../web/assets/img/icon-heart-empty.png")}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                var ref4;
                return (ref4 = this.scrollView) != null
                  ? ref4.scrollToEnd({
                      animated: true
                    })
                  : void 0;
              }}
            >
              <Image
                style={{
                  margin: 5,
                  width: 19,
                  height: 17
                }}
                source={require("../web/assets/img/icon-speech-bubble.png")}
              />
            </TouchableOpacity>
          </View>
          {function() {
            switch (this.props.note.published) {
              case "PENDING":
                if (this.props.isAdmin) {
                  return (
                    <TouchableOpacity onPress={this.approveNote.bind(this)}>
                      <Text
                        style={{
                          margin: 10
                        }}
                      >
                        Approve this note
                      </Text>
                    </TouchableOpacity>
                  );
                } else {
                  return (
                    <Text
                      style={{
                        margin: 10
                      }}
                    >
                      This note is visible only to you until a moderator
                      approves it.
                    </Text>
                  );
                }
                break;
              case "AUTO":
              case "APPROVED":
                return null;
            }
          }.call(this)}
          <Text
            style={{
              margin: 10
            }}
          >
            {this.props.note.pending
              ? "This note has not yet been uploaded."
              : this.props.note.created.toLocaleString()}
          </Text>
          <View>{writeParagraphs(this.props.note.description)}</View>
          {this.showFields(Text)}
          {this.props.note.pending ? null : this.state.comments === null ? (
            <Text
              style={{
                margin: 10
              }}
            >
              Loading comments...
            </Text>
          ) : (
            <SiftrComments
              note={this.props.note}
              auth={this.props.auth}
              comments={(ref4 = this.state.comments) != null ? ref4 : []}
              onEditComment={this.doEditComment.bind(this)}
              onNewComment={this.doNewComment.bind(this)}
              onDeleteComment={this.doDeleteComment.bind(this)}
              isAdmin={this.props.isAdmin}
            />
          )}
        </ScrollView>
      );
    }

  }

  SiftrNoteView.propTypes = {
    note: T.instanceOf(Note).isRequired,
    onClose: T.func,
    auth: T.instanceOf(Auth).isRequired,
    onDelete: T.func,
    onReload: T.func,
    isAdmin: T.bool,
    onPromptLogin: T.func,
    getColor: T.func,
    fields: T.arrayOf(T.instanceOf(Field))
  };

  SiftrNoteView.defaultProps = {
    onClose: function() {},
    onDelete: function() {},
    onReload: function() {},
    isAdmin: false,
    onPromptLogin: function() {},
    getColor: function() {
      return "black";
    }
  };

  return SiftrNoteView;
}.call(this);
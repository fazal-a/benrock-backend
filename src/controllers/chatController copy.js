import DatabaseConnection from "../database/connection";
import { User } from "../database/tables/user";
import { Chat } from "../database/tables/chats";
import { Message } from "../database/tables/messages";
// import ErrorHandler from "../utils/ErrorHandler";
// import SuccessHandler from "../utils/SuccessHandler";
const { ErrorHandler } = require("../utils/ErrorHandler");
const { SuccessHandler } = require("../utils/SuccessHandler");

// import { hashPassword } from "../utils/password";
const UserRepository = DatabaseConnection.getRepository(User);
const ChatRepository = DatabaseConnection.getRepository(Chat);
const MessageRepository = DatabaseConnection.getRepository(Message);

const UserSchema = require("../models/user");
const ChatSchema = require("../models/chat/chat");
const MessageSchema = require("../models/chat/messages");

// get profile
const getContacts = async (req, res) => {
  // #swagger.tags = ['profile']
  try {
    const user = await UserSchema.find({ _id: { $nin:  [req?.user?._id]} });

    if (user) {
      // console.log("user found");

      return res.json(user);
    }

    // let profiles = await UserRepository.find({
    //   select: ["_id", "name", "email"]
    // });
    return res.json(true);
    // return res.json(profiles);
  } catch (error) {
    ErrorHandler(error, 500, req, res);
  }
};

const getChats = async (req, res) => {
  try {
    const user = await UserSchema.findOne({ _id: req?.user?._id });

    if (user) {
      const chats = await ChatSchema.find({ users: { $in: [req?.user?._id] } }).populate("users lastMessage");

      if (chats) {
        return SuccessHandler(
          {
            message: `${
              chats.length > 0
                ? "Chats fetched successfully"
                : "No chats found. Start one!"
            }`,
            chats,
          },
          201,
          res
        );
      }else{

      }
    } else {
      return ErrorHandler("No user found", 500, req, res);
    }

  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const getChats = async (req, res) => {
//   // #swagger.tags = ['chat']

//   try {
//     const id = req.user._id;

//     const chats = await ChatRepository.createQueryBuilder("chat")
//       .innerJoin("chat.users", "user")
//       .where("user._id = :userId", { userId: id })
//       .leftJoinAndSelect("chat.users", "users")
//       .getMany();

//     if (!chats) {
//       return ErrorHandler("No chats found", 404, req, res);
//     } else {
//       let _chats = chats?.map((value) => ({
//         ...value,
//         users: value?.users?.map((user) => ({
//           _id: user?._id,
//           name: user?.name
//         }))
//       }));
//       return SuccessHandler(
//         {
//           message: `${
//             chats.length > 0
//               ? "Chats fetched successfully"
//               : "No chats found. Start one!"
//           }`,
//           chats: _chats
//         },
//         200,
//         res
//       );
//     }
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

const createChat = async (req, res) => {
  // #swagger.tags = ['chat']

  try {
    const { users } = req.body;

    console.log('users ---->' , users)

    const chat = await ChatSchema.findOne({
      users: { $all: users }
    });
    if (chat) {
      return SuccessHandler(
        {
          message: "Chat already exists",
          chat
        },
        200,
        res
      );
    } else {
      const newChat = new ChatSchema({
        users,
      });
      await newChat.save();
      return SuccessHandler(
        {
          message: "Chat created successfully",
          newChat
        },
        201,
        res
      );
    }


    // let chat = await ChatRepository.createQueryBuilder("chat")
    //   .innerJoin("chat.users", "user")
    //   .select(["chat._id"])
    //   .where("user._id IN (:...userIds)", { userIds: users })
    //   .groupBy("chat._id")
    //   .having(`COUNT(user._id) = ${users.length}`)
    //   .getOne();
    // if (chat) {
    //   return SuccessHandler(
    //     {
    //       message: "Chat already exists",
    //       chat,
    //     },
    //     200,
    //     res
    //   );
    // } else {
    //   let usersFromDB = await UserRepository.createQueryBuilder("user")
    //     .where("user._id IN (:...ids)", { ids: users })
    //     .getMany();

    //   console.log("usersFromDB", usersFromDB);
    //   const newChat = await ChatRepository.save({
    //     users: usersFromDB,
    //     lastMessage: null,
    //   });

    //   return SuccessHandler(
    //     {
    //       message: "Chat created successfully",
    //       newChat,
    //     },
    //     201,
    //     res
    //   );
    // }

  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

// const createChat = async (req, res) => {
//   // #swagger.tags = ['chat']

//   try {
//     const { users } = req.body;
//     let chat = await ChatRepository.createQueryBuilder("chat")
//       .innerJoin("chat.users", "user")
//       .select(["chat._id"])
//       .where("user._id IN (:...userIds)", { userIds: users })
//       .groupBy("chat._id")
//       .having(`COUNT(user._id) = ${users.length}`)
//       .getOne();
//     if (chat) {
//       return SuccessHandler(
//         {
//           message: "Chat already exists",
//           chat,
//         },
//         200,
//         res
//       );
//     } else {
//       let usersFromDB = await UserRepository.createQueryBuilder("user")
//         .where("user._id IN (:...ids)", { ids: users })
//         .getMany();

//       console.log("usersFromDB", usersFromDB);
//       const newChat = await ChatRepository.save({
//         users: usersFromDB,
//         lastMessage: null,
//       });

//       return SuccessHandler(
//         {
//           message: "Chat created successfully",
//           newChat,
//         },
//         201,
//         res
//       );
//     }
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req, res);
//   }
// };

const getChat = async (req, res) => {
  // #swagger.tags = ['chat']

  try {
    // const chat = await ChatRepository.findOne({
    //   where: {
    //     _id: req?.query?.id,
    //   },
    // });
    const chat = await ChatSchema.findOne({
        _id: req.params.id,
    });
    if (!chat) {
      return ErrorHandler("Chat not found", 404, req, res);
    }

    const messages = await MessageSchema.find({ chat: chat._id });
    await MessageSchema.updateMany({ chat: chat._id }, { $set: { isRead: true } });
    await ChatSchema.findOneAndUpdate(
      { _id: chat._id },
      { $set: { unSeenCount: 0 } }
    );

    // const messages = await MessageRepository.find({
    //   where: { chat: chat?._id },
    // });
    // await MessageRepository.createQueryBuilder()
    //   .update(Message)
    //   .set({ isRead: true })
    //   .where("chat.id = :chatId", { chatId: chat?.id })
    //   .execute();
    // let find = await ChatRepository.findOne({ where: { _id: chat._id } });
    // find.unSeenCount = 0;
    // await find.save();
    return SuccessHandler(
      {
        message: "Chat fetched successfully",
        messages
      },
      200,
      res
    );
  } catch (error) {
    return ErrorHandler(error.message, 500, req, res);
  }
};

export default { getContacts, getChat, getChats, createChat };
// const sendMessage = async (req, res) => {
//   // #swagger.tags = ['chat']

//   try {
//     const { message, chatId } = req.body;
//     const chat = await Chat.findById(chatId)
//       .populate({
//         path: "users",
//         select: "name email profilePic isMessageActive"
//       })
//       .populate({
//         path: "lastMessage",
//         select: "message createdAt sender"
//       });
//     if (!chat) {
//       return ErrorHandler("Chat not found", 404, res);
//     }
//     let newChat = false;
//     if (chat.lastMessage !== null) {
//       newChat = true;
//     }
//     const newMessage = new Message({
//       message,
//       chat: chatId,
//       sender: req.user._id
//     });
//     await newMessage.save();
//     await Chat.findOneAndUpdate(
//       { _id: chatId },
//       {
//         $set: {
//           lastMessage: newMessage._id,
//           unSeenCount: chat.unSeenCount + 1
//         }
//       }
//     );
//     // send message socket helper here
//     await newMessage.populate("sender", "name email profilePic");
//     const userToNotify = chat.users.filter(
//       (user) => user._id.toString() !== req.user._id.toString()
//     )[0];
//     console.log(chat.users, userToNotify, "------------");

//     sendMessageHelper(userToNotify, {
//       newMessage: newMessage,
//       chat: chat,
//       newChat: newChat
//     });
//     console.log(userToNotify.isMessageActive, req.user._id, "---- ids ");
//     if (userToNotify.isMessageActive != req.user._id?.toString())
//       await createNotification(
//         `${req.user?.name} messaged you`,
//         "message",
//         `${userToNotify?._id}`,
//         {
//           type: "chat",
//           sender: req.user?._id,
//           receiver: userToNotify?._id,
//           message: newMessage,
//           senderName: req.user?.name,
//           profilePic: req.user?.profilePic
//         }
//       );

//     return SuccessHandler(
//       {
//         message: "Message sent successfully",
//         newMessage
//       },
//       201,
//       res
//     );
//   } catch (error) {
//     return ErrorHandler(error.message, 500, req,res);
//   }
// };

// const updateMessageScreenStatus = async (req, res) => {
//   try {
//     const id = req.user._id,
//       user = req.body.user;
//     console.log(id, user);
//     let response = await User.findOneAndUpdate(
//       { _id: id },
//       {
//         $set: {
//           isMessageActive: user
//         }
//       }
//     );
//     console.log("response", response);
//     if (response)
//       SuccessHandler({ message: "Status updated successfully" }, 200, res);
//   } catch (error) {
//     ErrorHandler({ message: `${error}` }, 500, res);
//   }
// };

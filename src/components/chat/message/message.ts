import Block from "core/Block";
import "./message.scss";

interface MessageProps {
  time: string;
  text: string;
  imgPath: string;
  outgoing: boolean;
  delivered: boolean;
  readed: boolean;
}

export class Message extends Block<MessageProps> {
  static componentName = "Message";

  render() {
    return `
    <div class="chat__talk">
    </div>
     `;
  }
}

import React from "react";
import { type Creature } from "../types/creature";
import "./creatureInitiativeItem.css";

interface Props extends Creature {
  id: number;
}
 
interface State {
  currentHp?: number;
}
 
class CreatureInitiativeItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { currentHp: props.maxHp };
  }
  render() { 
    return ( <>
      <div className="creature-initiative-item">
        <div className="initiative">{this.props.initiative !== undefined && this.props.initiativeModifier !== undefined ? this.props.initiative + this.props.initiativeModifier : 'N/A'}</div>
        <div className="name">{this.props.name}</div>
        <div className="hp">{this.state.currentHp} / {this.props.maxHp}</div>
      </div>
    </>);
  }
}
 
export default CreatureInitiativeItem;
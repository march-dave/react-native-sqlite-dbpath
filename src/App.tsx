import * as React from 'react';
import Styled from 'styled-components/native';
import SQLite from 'react-native-sqlite-storage';

const Container = Styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #F5FCFF;
`;
const UserContainer = Styled.View`
  flex-direction: row;
`;
const UserInfo = Styled.Text`
  padding: 8px;
`;

interface Props {}
interface State {
  db: SQLite.SQLiteDatabase;
  users: Array<IUser>;
}

export default class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const db = SQLite.openDatabase(
      {
        name: 'TestDB.db',
        location: 'default',
        createFromLocation: '~www/TestDB.db',
      },
      () => {},
      error => {
        console.log(error);
      }
    );

    this.state = {
      db,
      users: [],
    };
  }

  render() {
    const { users } = this.state;
    return (
      <Container>
        {users.map((user: IUser, index: number) => (
          <UserContainer key={`user-info${index}`}>
            <UserInfo>{user.id}</UserInfo>
            <UserInfo>{user.name}</UserInfo>
            <UserInfo>{user.age}</UserInfo>
            <UserInfo>{user.email}</UserInfo>
          </UserContainer>
        ))}
      </Container>
    );
  }

  componentDidMount() {
    const { db } = this.state;

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM test;', [], (tx, results) => {
        const rows = results.rows;
        let users = [];

        for (let i = 0; i < rows.length; i++) {
          users.push({
            ...rows.item(i),
          });
        }

        this.setState({ users });
      });
    });
  }

  componentWillUnmount() {
    const { db } = this.state;

    db.close();
  }
}

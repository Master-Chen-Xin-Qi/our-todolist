function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="text-center my-4 custom-font">惊奇博士的Todo List</h1>
                </Col>
            </Row>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    // 分组和排序
    const user1Items = items.filter(item => item.user === '晶晶');
    const user1completedItems = user1Items.filter(item => item.completed);
    const user1uncompletedItems = user1Items.filter(item => !item.completed);
    const sortedUser1completedItems = user1completedItems.sort((a, b) => new Date(b.reminderDate) - new Date(a.reminderDate));
    const sortedUser1uncompletedItems = user1uncompletedItems.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
    const sortedUser1 = [...sortedUser1uncompletedItems, ...sortedUser1completedItems];

    const user2Items = items.filter(item => item.user === '祺祺');
    const user2completedItems = user2Items.filter(item => item.completed);
    const user2uncompletedItems = user2Items.filter(item => !item.completed);
    const sortedUser2completedItems = user2completedItems.sort((a, b) => new Date(b.reminderDate) - new Date(a.reminderDate));
    const sortedUser2uncompletedItems = user2uncompletedItems.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
    const sortedUser2 = [...sortedUser2uncompletedItems, ...sortedUser2completedItems];

    const user3Items = items.filter(item => item.user === '晶晶和祺祺');
    const user3completedItems = user3Items.filter(item => item.completed);
    const user3uncompletedItems = user3Items.filter(item => !item.completed);
    const sortedUser3completedItems = user3completedItems.sort((a, b) => new Date(b.reminderDate) - new Date(a.reminderDate));
    const sortedUser3uncompletedItems = user3uncompletedItems.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
    const sortedUser3 = [...sortedUser3uncompletedItems, ...sortedUser3completedItems];

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            <h2 className="custom-font" style={{ color: 'deeppink' }}>❤️晶晶的List</h2>
            {sortedUser1.map(item => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
            <h2 className="custom-font" style={{ color: 'green' }}>💪🏻祺祺的List</h2>
            {sortedUser2.map(item => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
            <h2 className="custom-font" style={{ color: 'blue' }}>🌟晶晶和祺祺的List</h2>
            {sortedUser3.map(item => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    // 获取今天的日期并格式化为 YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [newItem, setNewItem] = React.useState('');
    const [reminderDate, setReminderDate] = React.useState(getTodayDate());
    const [selectedUser, setSelectedUser] = React.useState('晶晶');
    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem, reminderDate, user: selectedUser }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
                setReminderDate(getTodayDate());
                setSelectedUser('晶晶');
            })
            .catch(() => {
                setSubmitting(false); // Reset submitting state on error
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New to do!"
                    aria-describedby="basic-addon1"
                    style={{width: '150px'}}
                />
                <Form.Control
                    type="date"
                    value={reminderDate}
                    onChange={e => setReminderDate(e.target.value)}
                    aria-describedby="basic-addon2"
                    style={{width: '100px'}}
                />
                <Form.Control
                    as="select"
                    value={selectedUser}
                    onChange={e => setSelectedUser(e.target.value)}
                    aria-describedby="basic-addon3"
                >
                    <option value="晶晶">晶晶</option>
                    <option value="祺祺">祺祺</option>
                    <option value="晶晶和祺祺">晶晶和祺祺</option>
                </Form.Control>
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length || !reminderDate || submitting}
                        className={submitting ? 'disabled' : ''}
                    >
                        {submitting ? 'Adding...' : 'Add Item'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}

function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Container, Row, Col, Button, Form } = ReactBootstrap;
    const [isEditing, setIsEditing] = React.useState(false);
    const [newName, setNewName] = React.useState(item.name);

    const toggleCompletion = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
                reminderDate: item.reminderDate.split('T')[0], // Ensure date format
                user: item.user
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    const saveName = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: newName,
                completed: item.completed,
                reminderDate: item.reminderDate.split('T')[0], // Ensure date format
                user: item.user
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(updatedItem => {
                onItemUpdate(updatedItem);
                setIsEditing(false);
            });
    };

    return (
        <Container fluid className={`item ${item.completed ? 'completed' : ''}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={
                            item.completed
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <i
                            className={`far ${
                                item.completed ? 'fa-check-square' : 'fa-square'
                            }`}
                        />
                    </Button>
                </Col>
                <Col xs={6} className={`name ${item.completed ? 'completed' : ''}`}>
                    {isEditing ? (
                        <Form.Control
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onBlur={saveName}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    saveName();
                                }
                            }}
                        />
                    ) : (
                        <span onClick={() => setIsEditing(true)}>{item.name}</span>
                    )}
                </Col>
                <Col xs={3} className="text-center">
                    {item.reminderDate}
                </Col>
                {/* <Col xs={2} className="text-center">
                    {item.user}
                </Col> */}
                <Col xs={1} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <i className="fa fa-trash text-danger" />
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

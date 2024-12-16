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
            <h4 className="custom-font" style={{ color: 'deeppink' }}>❤️晶晶的List</h4>
            {sortedUser1.map(item => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
            <h4 className="custom-font" style={{ color: 'green' }}>💪🏻祺祺的List</h4>
            {sortedUser2.map(item => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
            <h4 className="custom-font" style={{ color: 'blue' }}>🌟晶晶和祺祺的List</h4>
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
	    	    style={{width: '80px'}}
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
    const [editingField, setEditingField] = React.useState(null); // 新增状态来区分编辑的字段
    const [newName, setNewName] = React.useState(item.name);
    const [newReminderDate, setNewReminderDate] = React.useState(item.reminderDate);
    const nameInputRef = React.useRef(null);
    const dateInputRef = React.useRef(null);


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
        if (window.confirm('确定删除么?')) {
            fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() =>
                onItemRemoval(item),
            );
        }
    };

    const saveName = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: newName,
                completed: item.completed,
                reminderDate: newReminderDate.split('T')[0], // Ensure date format
                user: item.user
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(updatedItem => {
                onItemUpdate(updatedItem);
                setIsEditing(false);
                setEditingField(null); // 重置编辑字段状态
                document.activeElement.blur(); // 移除焦点
            });
    };

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                document.activeElement.blur(); // 失去所有焦点
                setIsEditing(false); // 退出编辑模式
                setEditingField(null); // 重置编辑字段状态
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    React.useEffect(() => {
        if (isEditing) {
            if (editingField === 'name' && nameInputRef.current) {
                nameInputRef.current.focus();
            } else if (editingField === 'date' && dateInputRef.current) {
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        }
    }, [isEditing, editingField]);

    return (
        <Container fluid className={`item ${item.completed ? 'completed' : ''}`}>
            <Row>
                <Col xs={1} className="text-center" style={{ marginLeft: '-10px' }}>
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
                            style={{ fontSize: '1.2rem', padding: '0rem' }}
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
                            ref={nameInputRef}
                        />
                    ) : (
                        <span onDoubleClick={() => {
                            setIsEditing(true);
                            setEditingField('name');
                        }}>{item.name}</span>
                    )}
                </Col>
                <Col xs={4} className="text-center" style={{ marginTop: '2.6px' }}>
                    {isEditing ? (
                        <Form.Control
                            type="date"
                            value={newReminderDate}
                            onChange={e => setNewReminderDate(e.target.value)}
                            onBlur={saveName}
                            onKeyPress={e => {
                                if (e.key === 'Enter') {
                                    saveName();
                                }
                            }}
                            ref={dateInputRef}
                            onFocus={(e) => e.target.showPicker()} // 使用showPicker方法
                        />
                    ) : (
                        <span onDoubleClick={() => {
                            setIsEditing(true);
                            setEditingField('date');
                        }}>{item.reminderDate}</span>
                    )}
                </Col>
                <Col xs={1} className="text-center remove" style={{ marginTop: '-1.5px' }}>
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
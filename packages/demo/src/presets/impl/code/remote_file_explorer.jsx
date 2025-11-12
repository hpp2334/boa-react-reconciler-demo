const { useState } = React;

function PaddingAll(props) {
  return (
    <padding
      top={props.value}
      bottom={props.value}
      left={props.value}
      right={props.value}
    >
      {props.children}
    </padding>
  );
}

function Button(props) {
  return (
    <row backgroundColor={props.backgroundColor || "gray"} onClick={props.onClick} testId={props.testId}>
      <PaddingAll value={8}>
        <row gap={4}>
          <text text={props.prefix} />
          <text text={props.text} />
        </row>
      </PaddingAll>
    </row>
  );
}

function FileExplorerItem(props) {
  const isFile = props.item.type === 'file';
  const icon = isFile ? '📄' : '📁';

  return (
    <row
      backgroundColor="lightgray"
      gap={8}
      crossAlignment="center"
      onClick={isFile ? undefined : props.onClick}
      testId={`item-${props.item.id}`}
    >
      <text text={icon} fontSize={16} />
      <text text={props.item.name} fontSize={16} testId={`text-${props.item.id}`} />
      <row width="100%" justifyContent="flex-end">
        <text text={props.item.size || ''} fontSize={12} color="gray" />
      </row>
    </row>
  );
}

// Mock API functions with random delays
function mockFetchItems(path = '/') {
  return new Promise((resolve) => {
    const delay = Math.random() * 500;

    setTimeout(() => {
      const mockData = generateMockFileStructure(path);
      resolve({
        success: true,
        data: mockData,
        path: path
      });
    }, delay);
  });
}

function generateMockFileStructure(path) {
  const basePath = path === '/' ? '' : path;

  if (path === '/') {
    return [
      { id: '1', name: 'Documents', type: 'folder', size: '2.5 MB', path: '/Documents' },
      { id: '2', name: 'Downloads', type: 'folder', size: '15.3 MB', path: '/Downloads' },
      { id: '3', name: 'Pictures', type: 'folder', size: '125 MB', path: '/Pictures' },
      { id: '4', name: 'Videos', type: 'folder', size: '2.1 GB', path: '/Videos' },
      { id: '5', name: 'readme.txt', type: 'file', size: '2.4 KB', path: '/readme.txt' },
      { id: '6', name: 'config.json', type: 'file', size: '1.1 KB', path: '/config.json' }
    ];
  } else if (path === '/Documents') {
    return [
      { id: '7', name: 'Work', type: 'folder', size: '890 KB', path: '/Documents/Work' },
      { id: '8', name: 'Personal', type: 'folder', size: '1.6 MB', path: '/Documents/Personal' },
      { id: '9', name: 'report.pdf', type: 'file', size: '456 KB', path: '/Documents/report.pdf' },
      { id: '10', name: 'notes.txt', type: 'file', size: '12 KB', path: '/Documents/notes.txt' }
    ];
  } else if (path === '/Downloads') {
    return [
      { id: '11', name: 'installer.exe', type: 'file', size: '12.3 MB', path: '/Downloads/installer.exe' },
      { id: '12', name: 'image.jpg', type: 'file', size: '2.8 MB', path: '/Downloads/image.jpg' },
      { id: '13', name: 'archive.zip', type: 'file', size: '245 KB', path: '/Downloads/archive.zip' }
    ];
  } else if (path === '/Pictures') {
    return [
      { id: '14', name: 'Vacation', type: 'folder', size: '45 MB', path: '/Pictures/Vacation' },
      { id: '15', name: 'Family', type: 'folder', size: '78 MB', path: '/Pictures/Family' },
      { id: '16', name: 'screenshot.png', type: 'file', size: '1.2 MB', path: '/Pictures/screenshot.png' }
    ];
  } else {
    // Default empty folder for any other path
    return [
      { id: '17', name: '.. (Parent)', type: 'folder', size: '-', path: getParentPath(path) }
    ];
  }
}

function getParentPath(path) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length <= 1) return '/';
  parts.pop();
  return '/' + parts.join('/');
}

function FileExplorer() {
  const [items, setItems] = useState([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchItems = async (path) => {
    setLoading(true);
    setError('');

    try {
      const result = await mockFetchItems(path);
      if (result.success) {
        setItems(result.data);
        setCurrentPath(result.path);
      } else {
        setError('Failed to fetch files');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    if (item.type === 'folder') {
      fetchItems(item.path);
    }
  };

  const handleBack = () => {
    if (currentPath !== '/') {
      const parentPath = getParentPath(currentPath);
      fetchItems(parentPath);
    }
  };

  const handleRefresh = () => {
    fetchItems(currentPath);
  };

  // Load initial data
  React.useEffect(() => {
    fetchItems('/');
  }, []);

  return (
    <column width="100%" mainAlignment="center" gap={8}>
      <text text="Remote File Explorer" fontSize={24} />

      <row gap={8} width="400px">
        <Button
          prefix="←"
          text="Back"
          onClick={handleBack}
          testId="btn-back"
          backgroundColor={currentPath === '/' ? 'lightgray' : 'gray'}
        />
        <Button
          prefix="↻"
          text="Refresh"
          onClick={handleRefresh}
          testId="btn-refresh"
        />
        <text
          text={`Path: ${currentPath}`}
          fontSize={14}
          color="blue"
          testId="text-path"
        />
      </row>

      {loading && (
        <row width="400px" mainAlignment="center" padding={16}>
          <text text="Loading..." fontSize={16} testId="text-loading" />
        </row>
      )}

      {error && (
        <row width="400px" backgroundColor="red" padding={8}>
          <text text={error} fontSize={14} color="white" testId="text-error" />
        </row>
      )}

      {!loading && !error && (
        <column gap={4} width="400px" height="300px" backgroundColor="white" border="1px solid gray">
          <text text={`Items: ${items.length}`} fontSize={12} color="gray" testId="text-count" />
          {items.map((item) => (
            <FileExplorerItem
              key={item.id}
              item={item}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </column>
      )}
    </column>
  );
}

function App() {
  return <FileExplorer />;
}
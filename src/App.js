import { gql, useQuery, useMutation } from '@apollo/client';
import { ApolloProvider } from '@apollo/client';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

const GETCHARACTER = gql`
	query getCharacters {
		character {
			id
			name
		}
	}
`;

const ADDCHARACTER = gql`
	mutation addCharacter {
		insert_character_one(object: { name: "Hero" }) {
			id
			name
		}
	}
`;

const REMOVECHARACTER = gql`
	mutation removeCharacter($id: uuid = "") {
		delete_character_by_pk(id: $id) {
			id
			name
		}
	}
`;

function Characters({ charaSelected }) {
	const { loading, error, data } = useQuery(GETCHARACTER);
	const [addCharacter] = useMutation(ADDCHARACTER, {
		refetchQueries: [{ query: GETCHARACTER }, 'getCharacters'],
	});
	const [removeCharacter] = useMutation(REMOVECHARACTER, {
		refetchQueries: [{ query: GETCHARACTER }, 'getCharacters'],
	});

	if (loading) return 'Loading...';
	if (error) return `Error! ${error.message}`;

	return (
		<div>
			<div>
				{data.character.map((cha) => {
					return (
						<div>
							<h2 key={cha.id}>{cha.name}</h2>
							<button
								onClick={() => {
									removeCharacter({
										variables: { id: cha.id },
									});
								}}
							>
								X
							</button>
						</div>
					);
				})}
			</div>
			<button
				onClick={() => {
					addCharacter();
				}}
			>
				Add Character
			</button>
		</div>
	);
}

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: 'https://thirddrill.hasura.app/v1/graphql',
	}),
});

const App = () => (
	<ApolloProvider client={client}>
		<h1>Third Drill</h1>
		<Characters />
	</ApolloProvider>
);

export default App;

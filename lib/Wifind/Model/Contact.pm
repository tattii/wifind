package Wifind::Model::Contact;

use MongoDB;

my $DB = "wifind";
my $COLLECTION = "contact";


sub add
{
	my $param = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);

	my $id = $coll->insert({
		message	=> $param->{message},
		name	=> $param->{name},
		mail	=> $param->{mail},
		time	=> time(),
	});
	return $id;
}


sub getAll
{
	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);

	my $result = $coll->find();

	my @contacts;
	while (my $contact = $result->next){
		push @contacts, $contact;
	}

	return \@contacts;
}

1;

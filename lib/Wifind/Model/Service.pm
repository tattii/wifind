package Wifind::Model::Service;

use MongoDB;


my $DB = "test";
my $COLLECTION = "wifind_service";



sub getServiceData
{
	my $name = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);
	my $result = $coll->find_one({ name => $name });

	return $result;
}



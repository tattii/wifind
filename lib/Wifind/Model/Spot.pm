package Wifind::Model::Spot;

use MongoDB;


my $DB = "test";
my $COLLECTION = "wifind03";


# idから検索
sub getSpotData
{
	my $id = shift;

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);
	my $result = $coll->find_one({ _id => $id });

	return $result;
}

# 周辺検索
sub findCenter
{
	my %param = @_;

	if ( !defined $param{lat} || !defined $param{lng} ){
		return { status => 'INVALID_REQUEST' };
	}

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);
	my $result = $coll->find({
			intensity => { 
				'$gt' => 16 - $param{zoom},
			},
			loc => { 
				'$near' =>	[
					$param{lng} +=0,
					$param{lat} +=0,
				], 
			}
	})->limit($param{limit});

	my $spots = [];
	while (my $spot = $result->next){
		push @$spots, $spot;
	}

	return {
		status => 'OK',
		results => $spots,
	};
}


# 領域内検索
sub findBounds
{
	my %param = @_;

	my @corner = split(/,/, $param{bounds}); # lat_sw, lng_sw, lat_ne, lng_ne

	if ( @corner < 4 ){
		return { status => 'INVALID_REQUEST' };
	}

	my $coll = MongoDB::MongoClient->new->get_database($DB)->get_collection($COLLECTION);
	my $result = $coll->find({
			intensity => { 
				'$gt' => 16 - $param{zoom},
			},
			loc => { 
				'$within' =>	{
					'$box' => [
						[ $corner[1] +=0, $corner[0] +=0 ],
						[ $corner[3] +=0, $corner[2] +=0 ],
					]
				} 
			}
	})->limit($param{limit});

	my $spots = [];
	while (my $spot = $result->next){
		push @$spots, $spot;
	}
	return {
		status => 'OK',
		results => $spots,
	};
}








1;


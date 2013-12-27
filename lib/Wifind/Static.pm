package Wifind::Static;

use Mojo::Base 'Mojolicious::Controller';

sub about
{
	my $self = shift;
	$self->render('static/about');
}


1;

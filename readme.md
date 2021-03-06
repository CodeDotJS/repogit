<h1 align="center">
	<br>
	<img width="300" src="https://raw.githubusercontent.com/CodeDotJS/repogit/master/media/text45.png">
	<br>
	<img src="https://travis-ci.org/CodeDotJS/repogit.svg?branch=master">  <img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg">
	<br>
</h1>

<p align="center"> <b> Search GitHub repositories from the command line! </b></p>

## Install

```
$ npm install --global repogit
```

## Usage

```
 Usage    : repogit <repository>
	  : repogit <repository> [commands]
	  : repogit <repository> [commands] <next-page>

 Commands :
  -search                     Normal search
  -best--match                Find the best match
  -most--stars                Find repositories with most stars
  -few--stars                 Find repositories with the least stars
  -most--forks                Find repositories with most forks
  -few--forks                 Find repositories with lest forks
  -recently--updated          Find recently updated repositories
  -least-recently--updated    Find least recently updated repositories

 Help     :
  $ repogit nodejs
  $ repogit google -most--stars
  $ repogit "twitter bot js" -search 2
  $ repogit "github bot" -recently--updated 3
```

## Preview

<p align="center"><img src="https://raw.githubusercontent.com/CodeDotJS/repogit/master/media/repogit.gif"></p>

## License

MIT &copy; [Rishi Giri](http://rishigiri.ml)

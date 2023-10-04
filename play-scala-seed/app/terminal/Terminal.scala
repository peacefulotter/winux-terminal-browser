package terminal

import akka.actor.{ActorRef, ActorSystem}
import models.Response
import os.Path
import terminal.cmds._
import terminal.features.{Autocomplete, History}
import terminal.helpers.InputHelper.parseInput
import terminal.stream.{Basic, Grep, LineStreamHandler}

import scala.concurrent.ExecutionContext

class Terminal(manager: ActorRef)(implicit system: ActorSystem, implicit val ec: ExecutionContext) {
	// features
	val history = new History
	val autocomplete = new Autocomplete
	
	private def getCommand(text: String, path: Path, session: Int): (Option[Command], List[String]) = {
		val input = parseInput(text)
		if (input.isEmpty) {
			return (Option.empty[Command], Nil)
		}
		
		val (keyword, params) = (input.head, input.tail)
		val cmd: Command = keyword match {
			case "cat" => new Cat(this, path, session)
			case "cd" => new Cd(path)
			case "ls" => new Ls(path)
			case "find" => new Find(manager, path, session)
			case "history" => new HistoryCmd(history)
			case "colors" => new Colors()
			case "system" => new System()
			case "top" => new Top(manager, session)
			case _ => new Builtin(keyword, path) // new Err(keyword)
		}
		(Some(cmd), params)
	}
	
	def handleCommand(text: String, path: Path, session: Int): Response = {
		getCommand(text, path, session) match {
			case (Some(cmd), params) =>
				val res = cmd.handle(params)
				history.push(text)
				println(s"RES from command $res")
				res
			case _ => Response.Nothing()
		}
	}

	val defaultStreamHandler: LineStreamHandler = new Basic(manager)
	
	def getStreamHandler(params: List[String]): LineStreamHandler = params match {
		case cmd :: xs => cmd match {
			case "grep" => new Grep(manager, xs)
			case _ => defaultStreamHandler
		}
		case _ => defaultStreamHandler
	}
	
	
	private def handleKill(): Unit = println("===== killing")
}
